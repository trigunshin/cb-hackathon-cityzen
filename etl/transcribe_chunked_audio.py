import openai
import os
from pydub import AudioSegment
import tempfile
from tqdm import tqdm  # For progress bars
import argparse
import time  # For sleep in retries
from pinecone import Pinecone
import uuid
from llama_index.core import Document
from llamacone.indexer import index_documents

# ----------------------------
# Configuration
# ----------------------------

# Set your OpenAI and Pinecone API keys as environment variables for security
openai.api_key = os.getenv('OPENAI_API_KEY')
if not openai.api_key:
    raise ValueError("OpenAI API key not found. Please set the OPENAI_API_KEY environment variable.")
# Initialize OpenAI
openai_transcription_client = openai.OpenAI(api_key=openai.api_key)


pinecone_api_key = os.getenv('PINECONE_API_KEY')
pinecone_environment = os.getenv('PINECONE_ENVIRONMENT')  # e.g., 'us-east1-aws'
if not pinecone_api_key or not pinecone_environment:
    raise ValueError(
        "Pinecone API key or environment not found. Please set PINECONE_API_KEY and PINECONE_ENVIRONMENT environment variables.")

# Initialize Pinecone
pinecone = Pinecone(api_key=pinecone_api_key, environment=pinecone_environment)
# Create or connect to an index
index_name = os.getenv('PINECONE_INDEX_NAME')
index = pinecone.Index(index_name)


# ----------------------------
# Function Definitions
# ----------------------------

def split_audio(file_path, chunk_length_ms=5 * 60 * 1000, overlap_ms=1000):
    """
    Splits the audio file into chunks of specified length in milliseconds with overlap.

    :param file_path: Path to the input audio file.
    :param chunk_length_ms: Length of each chunk in milliseconds (default: 5 minutes).
    :param overlap_ms: Overlap between chunks in milliseconds (default: 1 second).
    :return: List of file paths to the audio chunks.
    """
    audio = AudioSegment.from_file(file_path)
    total_length_ms = len(audio)
    chunks = []
    for i in range(0, total_length_ms, chunk_length_ms - overlap_ms):
        chunk = audio[i:i + chunk_length_ms]
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
        chunk.export(temp_file.name, format="mp3")
        chunks.append(temp_file.name)
        print(f"Created chunk: {temp_file.name}")
    return chunks


def get_embedding(text, model="text-embedding-3-large"):
    """
    Generates an embedding for the given text using OpenAI's Embedding API.

    :param text: The text to embed.
    :param model: The embedding model to use.
    :return: The embedding vector.
    """
    response = openai.Embedding.create(
        input=text,
        model=model
    )
    embedding = response['data'][0]['embedding']
    return embedding

def parse_transcription(transcription_data):
    """
    Parses transcription data to extract text and metadata segments.

    :param transcription_data: Dictionary containing 'text' and 'segments'.
    :return: List of segments with metadata.
    """
    segments = transcription_data.get("segments", [])
    parsed_segments = []
    for segment in segments:
        parsed_segment = {
            "text": segment.text if hasattr(segment, 'text') else '',
            "start_time": segment.start if hasattr(segment, 'start') else 0.0,
            "end_time": segment.end if hasattr(segment, 'end') else 0.0,
            "speaker": segment.speaker if hasattr(segment, 'speaker') else 'Unknown'  # Default to 'Unknown' if not provided
        }
        parsed_segments.append(parsed_segment)
    return parsed_segments


def transcribe_audio_chunk(chunk_path, model="whisper-1", language=None, max_retries=5, verbose=False):
    """
    Transcribes a single audio chunk using OpenAI's Whisper API with retry logic and verbose output.

    :param chunk_path: Path to the audio chunk.
    :param model: Whisper model to use.
    :param language: Language of the audio (optional).
    :param max_retries: Maximum number of retries for transient errors.
    :param verbose: Whether to request verbose output (timestamps, speakers).
    :return: Transcribed data with metadata.
    """
    attempt = 0
    while attempt < max_retries:
        try:
            with open(chunk_path, 'rb') as audio_file:
                print(f"Uploading {chunk_path} for transcription...")
                transcript = openai_transcription_client.audio.transcriptions.create(
                    model=model,
                    file=audio_file,
                    language=language,
                    response_format="verbose_json" if verbose else "text"
                )
            # Access attributes directly
            text = transcript.text
            segments = transcript.segments if hasattr(transcript, 'segments') else []
            if text:
                print(f"Transcription successful for {chunk_path}")
                return {"text": text, "segments": segments}
            else:
                print(f"No text returned for {chunk_path}")
                return {"text": "", "segments": []}
        except Exception as e:
            print(f"Unexpected error for {chunk_path}: {e}")
            return {"text": "", "segments": []}
    print(f"Failed to transcribe {chunk_path} after {max_retries} attempts.")
    return {"text": "", "segments": []}


def upsert_transcript(transcripts, index):
    [text for text in transcripts if text]


def transcribe_large_audio(input_file_path, output_file_path, segments_output_path, chunk_length_ms=5 * 60 * 1000,
                           overlap_ms=1000, model="whisper-1", language=None, index=None):
    """
    Splits a large audio file into chunks, transcribes each chunk, upserts into Pinecone, writes the combined transcript to a file, and saves segments as JSON.

    :param input_file_path: Path to the input audio file.
    :param output_file_path: Path to the output transcript text file.
    :param segments_output_path: Path to the output segments JSON file.
    :param chunk_length_ms: Length of each chunk in milliseconds (default: 5 minutes).
    :param overlap_ms: Overlap between chunks in milliseconds (default: 1 second).
    :param model: Whisper model to use.
    :param language: Language of the audio (optional).
    :param index: Pinecone index object.
    """
    try:
        # Step 1: Split the audio into chunks
        print("Splitting audio into chunks...")
        chunks = split_audio(input_file_path, chunk_length_ms, overlap_ms)

        # Step 2: Transcribe each chunk with progress bar
        transcripts = []
        all_segments = []
        for chunk in tqdm(chunks, desc="Transcribing chunks"):
            transcription_data = transcribe_audio_chunk(chunk, model, language)
            transcripts.append(transcription_data['text'])
            segments = parse_transcription(transcription_data)
            all_segments.extend(segments)

        # Step 3: Save segments to JSON file for review
        with open(segments_output_path, 'w', encoding='utf-8') as f:
            import json
            json.dump(all_segments, f, ensure_ascii=False, indent=4)
        print(f"Segments saved to {segments_output_path}")

        # Step 4: Upsert segments into Pinecone
        if index and all_segments:
            print("Upserting segments into Pinecone...")
            # upsert_transcription_segments(all_segments, index)

        # Step 5: Combine transcripts
        combined_transcript = "\n".join(transcripts)

        # Step 6: Write to output transcript file
        with open(output_file_path, 'w', encoding='utf-8') as f:
            f.write(combined_transcript)
        print(f"Transcription successful! Combined transcript saved to {output_file_path}")

        if index and transcripts:
            print("upserting text to pinecone")
            upsert_transcript(transcripts, index)

    finally:
        # Clean up temporary chunk files
        for chunk in chunks:
            try:
                os.remove(chunk)
                print(f"Deleted temporary file: {chunk}")
            except OSError as e:
                print(f"Error deleting temporary file {chunk}: {e}")


# ----------------------------
# Main Execution
# ----------------------------
# GET
# 	https://lacity.primegov.com/api/v2/PublicPortal/ListArchivedMeetings?year=2024
# [results].filter(item => item.videoUrl && !item.title.includes('- SAP'))
if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Transcribe large MP3 files using OpenAI's Whisper API and store in Pinecone.")
    parser.add_argument("input_mp3", help="Path to the input MP3 file.")
    parser.add_argument("output_txt", help="Path to the output transcript text file.")
    parser.add_argument("segments_output_json", help="Path to the output segments JSON file.")
    parser.add_argument("--chunk-length-min", type=int, default=5, help="Chunk length in minutes (default: 5).")
    parser.add_argument("--overlap-sec", type=int, default=1, help="Overlap between chunks in seconds (default: 1).")
    parser.add_argument("--model", type=str, default="whisper-1", help="Whisper model to use (default: whisper-1).")
    parser.add_argument("--language", type=str, default=None, help="Language of the audio (e.g., 'en').")
    parser.add_argument("--verbose", action='store_true', help="Enable verbose transcription with metadata.")
    args = parser.parse_args()

    chunk_length_ms = args.chunk_length_min * 60 * 1000
    overlap_ms = args.overlap_sec * 1000

    transcribe_large_audio(
        input_file_path=args.input_mp3,
        output_file_path=args.output_txt,
        segments_output_path=args.segments_output_json,
        chunk_length_ms=chunk_length_ms,
        overlap_ms=overlap_ms,
        model=args.model,
        language=args.language,
        index=index
    )
"""
    # Upsert in batches (recommended for performance)
    batch_size = 100  # Adjust based on your needs
    for i in range(0, len(upsert_data), batch_size):
        batch = upsert_data[i:i + batch_size]
        index.upsert(vectors=batch)
        print(f"Upserted batch {i // batch_size + 1}")
"""