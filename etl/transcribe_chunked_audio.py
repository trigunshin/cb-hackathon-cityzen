import openai
import os
from pydub import AudioSegment
import tempfile
from tqdm import tqdm  # For progress bars
import argparse

# ----------------------------
# Configuration
# ----------------------------

# Ensure your OpenAI API key is set as an environment variable for security
openai.api_key = os.getenv('OPENAI_API_KEY')

print(os.getenv('OPENAI_API_KEY')[:5])
openai_transcription_client = openai.OpenAI()
if not openai.api_key:
    raise ValueError("OpenAI API key not found. Please set the OPENAI_API_KEY environment variable.")


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


def transcribe_audio_chunk(chunk_path, model="whisper-1", language=None, max_retries=5):
    """
    Transcribes a single audio chunk using OpenAI's Whisper API with retry logic.

    :param chunk_path: Path to the audio chunk.
    :param model: Whisper model to use.
    :param language: Language of the audio (optional).
    :param max_retries: Maximum number of retries for transient errors.
    :return: Transcribed data with metadata.

    """
    attempt = 0
    while attempt < max_retries:
        try:
            with open(chunk_path, 'rb') as audio_file:
                print(f"Uploading {chunk_path} for transcription...")
                # Use create_transcription instead of transcribe
                if language:
                    transcript = openai_transcription_client.audio.transcriptions.create(
                        model=model,
                        file=audio_file,
                        language=language,
                        response_format="verbose_json"
                    )
                else:
                    transcript = openai_transcription_client.audio.transcriptions.create(
                        model=model,
                        file=audio_file,
                        response_format="verbose_json"
                    )
            text = transcript.text
            segments = transcript.segments if hasattr(transcript, 'segments') else []
            if text:
                print(f"Transcription successful for {chunk_path}")
                return {"text": text, "segments": segments}
            else:
                print(f"No text returned for {chunk_path}")
                return {"text": "", "segments": []}
        except openai.APIError as e:
            print(f"OpenAI API error for {chunk_path}: {e}")
            return ""
        except Exception as e:
            print(f"Unexpected error for {chunk_path}: {e}")
            return ""
    print(f"Failed to transcribe {chunk_path} after {max_retries} attempts.")
    return ""


def transcribe_large_audio(input_file_path, output_file_path, chunk_length_ms=5 * 60 * 1000, overlap_ms=1000,
                           model="whisper-1", language=None):
    """
    Splits a large audio file into chunks, transcribes each chunk, and writes the combined transcript to a file.

    :param input_file_path: Path to the input audio file.
    :param output_file_path: Path to the output transcript file.
    :param chunk_length_ms: Length of each chunk in milliseconds (default: 5 minutes).
    :param overlap_ms: Overlap between chunks in milliseconds (default: 1 second).
    :param model: Whisper model to use.
    :param language: Language of the audio (optional).
    """
    try:
        # Step 1: Split the audio into chunks
        print("Splitting audio into chunks...")
        chunks = split_audio(input_file_path, chunk_length_ms, overlap_ms)

        # Step 2: Transcribe each chunk with progress bar
        transcripts = []
        for chunk in tqdm(chunks, desc="Transcribing chunks"):
            text = transcribe_audio_chunk(chunk, model, language)
            transcripts.append(text)

        # Step 3: Combine transcripts
        combined_transcript = "\n".join(transcripts)

        # Step 4: Write to output file
        with open(output_file_path, 'w', encoding='utf-8') as f:
            f.write(combined_transcript)
        print(f"Transcription successful! Combined transcript saved to {output_file_path}")

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

if __name__ == "__main__":
    import time  # Importing time for sleep in retries

    parser = argparse.ArgumentParser(description="Transcribe large MP3 files using OpenAI's Whisper API.")
    parser.add_argument("input_mp3", help="Path to the input MP3 file.")
    parser.add_argument("output_txt", help="Path to the output transcript text file.")
    parser.add_argument("--chunk-length-min", type=int, default=5, help="Chunk length in minutes (default: 5).")
    parser.add_argument("--overlap-sec", type=int, default=1, help="Overlap between chunks in seconds (default: 1).")
    parser.add_argument("--model", type=str, default="whisper-1", help="Whisper model to use (default: whisper-1).")
    parser.add_argument("--language", type=str, default=None, help="Language of the audio (e.g., 'en').")
    args = parser.parse_args()

    chunk_length_ms = args.chunk_length_min * 60 * 1000
    overlap_ms = args.overlap_sec * 1000

    transcribe_large_audio(
        input_file_path=args.input_mp3,
        output_file_path=args.output_txt,
        chunk_length_ms=chunk_length_ms,
        overlap_ms=overlap_ms,
        model=args.model,
        language=args.language
    )
