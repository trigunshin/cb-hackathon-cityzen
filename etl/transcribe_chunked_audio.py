import openai
import os
import shutil
from pydub import AudioSegment
import tempfile
from tqdm import tqdm  # For progress bars
import argparse
import time  # For sleep in retries
from pinecone import Pinecone
import ffmpeg
import uuid

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
def split_audio_ffmpeg_python(input_file, output_pattern, segment_time):
    """
    Splits the input audio file into segments using ffmpeg-python.

    :param input_file: Path to the input audio file.
    :param output_pattern: Output file pattern (e.g., 'output%03d.webm').
    :param segment_time: Duration of each segment in seconds.
    """
    try:
        (
            ffmpeg
            .input(input_file)
            .output(output_pattern, f='segment', segment_time=segment_time, c='copy')
            .run()
        )
        print("Audio successfully split into segments.")
    except ffmpeg.Error as e:
        print(f"An error occurred: {e.stderr.decode()}")

# # Usage
# input_file_path = 'path/to/input.webm'
# output_file_pattern = 'path/to/output%03d.webm'
# segment_duration_seconds = 600  # 10 minutes
#
# split_audio_ffmpeg_python(input_file_path, output_file_pattern, segment_duration_seconds)


def split_audio(file_path, chunk_length_ms=5 * 60 * 1000, overlap_ms=1000, format: str="webm"):
    """
    Splits the audio file into chunks of specified length in milliseconds with overlap.

    :param file_path: Path to the input audio file.
    :param chunk_length_ms: Length of each chunk in milliseconds (default: 5 minutes).
    :param overlap_ms: Overlap between chunks in milliseconds (default: 1 second).
    :return: List of file paths to the audio chunks.
    """

    audio = AudioSegment.from_file(file_path, format=format)
    total_length_ms = len(audio)
    chunks = []
    for i in range(0, total_length_ms, chunk_length_ms - overlap_ms):
        chunk = audio[i:i + chunk_length_ms]
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".webm")
        chunk.export(temp_file.name, format="webm")
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
                    response_format="verbose_json" if verbose else "json"
                )
            # Access attributes directly
            text = transcript.text
            if text:
                print(f"Transcription successful for {chunk_path}")
                return {"text": text}
            else:
                print(f"No text returned for {chunk_path}")
                return {"text": ""}
        except Exception as e:
            print(f"Unexpected error for {chunk_path}: {e}")
            return {"text": ""}
    print(f"Failed to transcribe {chunk_path} after {max_retries} attempts.")
    return {"text": ""}


def upsert_transcript(transcripts, index):
    # [text for text in transcripts if text]
    """
        # Upsert in batches (recommended for performance)
        batch_size = 100  # Adjust based on your needs
        for i in range(0, len(upsert_data), batch_size):
            batch = upsert_data[i:i + batch_size]
            index.upsert(vectors=batch)
            print(f"Upserted batch {i // batch_size + 1}")
    """
    pass

def transcribe_large_audio(input_file_path, output_file_path, chunk_length_ms=5 * 60 * 1000,
                           overlap_ms=1000, model="whisper-1", language=None, index=None):
    """
    Splits a large audio file into chunks, transcribes each chunk, upserts into Pinecone, and writes the combined transcript to a file.

    :param input_file_path: Path to the input audio file.
    :param output_file_path: Path to the output transcript text file.
    :param chunk_length_ms: Length of each chunk in milliseconds (default: 5 minutes).
    :param overlap_ms: Overlap between chunks in milliseconds (default: 1 second).
    :param model: Whisper model to use.
    :param language: Language of the audio (optional).
    :param index: Pinecone index object.
    """
    try:
        # Step 1: Split the audio into chunks using ffmpeg
        print("Splitting audio into chunks...")
        temp_dir = tempfile.mkdtemp()
        output_pattern = os.path.join(temp_dir, "chunk%03d.webm")
        split_audio_ffmpeg_python(input_file_path, output_pattern, chunk_length_ms / 1000)

        # Collect the generated chunk files
        chunks = sorted([os.path.join(temp_dir, f) for f in os.listdir(temp_dir) if f.endswith('.webm')])

        # Step 2: Transcribe each chunk with progress bar
        transcripts = []
        for chunk in tqdm(chunks, desc="Transcribing chunks"):
            transcription_data = transcribe_audio_chunk(chunk, model, language)
            transcripts.append(transcription_data['text'])

        # Step 5: Combine transcripts
        combined_transcript = "\n".join(transcripts)

        # Step 6: Write to output transcript file
        with open(output_file_path, 'w', encoding='utf-8') as f:
            f.write(combined_transcript)
        print(f"Transcription successful! Combined transcript saved to {output_file_path}")

        if index and transcripts:
            print("upserting text to pinecone")
            # upsert_transcript(transcripts, index)
    finally:
        # Clean up the temporary directory and its contents
        try:
            shutil.rmtree(temp_dir)
            print(f"Deleted temporary directory: {temp_dir}")
        except OSError as e:
            print(f"Error deleting temporary directory {temp_dir}: {e}")


def main():
    parser = argparse.ArgumentParser(
        description="Transcribe large audio files using OpenAI's Whisper API and store in Pinecone.")
    parser.add_argument("--data-dir", type=str, default="data", help="Directory containing the input audio files.")
    parser.add_argument("--transcripts-dir", type=str, default="transcripts",
                        help="Directory to store the output transcripts.")
    parser.add_argument("--chunk-length-min", type=int, default=5, help="Chunk length in minutes (default: 5).")
    parser.add_argument("--overlap-sec", type=int, default=1, help="Overlap between chunks in seconds (default: 1).")
    parser.add_argument("--model", type=str, default="whisper-1", help="Whisper model to use (default: whisper-1).")
    parser.add_argument("--language", type=str, default=None, help="Language of the audio (e.g., 'en').")
    parser.add_argument("--verbose", action='store_true', help="Enable verbose transcription with metadata.")
    args = parser.parse_args()

    chunk_length_ms = args.chunk_length_min * 60 * 1000
    overlap_ms = args.overlap_sec * 1000

    data_dir = args.data_dir
    transcripts_dir = args.transcripts_dir

    for filename in os.listdir(data_dir):
        if filename.endswith('.webm'):
            video_id = os.path.splitext(filename)[0]
            transcript_path = os.path.join(transcripts_dir, f"{video_id}.txt")

            if not os.path.exists(transcript_path):
                input_file_path = os.path.join(data_dir, filename)
                output_file_path = transcript_path
                print(f"Transcription starting for {filename}")
                transcribe_large_audio(
                    input_file_path=input_file_path,
                    output_file_path=output_file_path,
                    chunk_length_ms=chunk_length_ms,
                    overlap_ms=overlap_ms,
                    model=args.model,
                    language=args.language,
                    index=index
                )
                print(f"Transcription completed for {filename}")


if __name__ == "__main__":
    main()
