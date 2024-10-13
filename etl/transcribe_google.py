import os
import argparse
import json
import tempfile
from google.cloud import speech
from google.cloud import storage
from pydub import AudioSegment
from tqdm import tqdm
import uuid
import time
from google.api_core.exceptions import RetryError, InvalidArgument, GoogleAPICallError

def upload_to_gcs(bucket_name, source_file_name, destination_blob_name):
    """
    Uploads a file to Google Cloud Storage.

    :param bucket_name: Name of the GCS bucket.
    :param source_file_name: Path to the local file to upload.
    :param destination_blob_name: Destination path in the bucket.
    :return: GCS URI of the uploaded file.
    """
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)
    print(f"Uploaded {source_file_name} to gs://{bucket_name}/{destination_blob_name}")

    return f"gs://{bucket_name}/{destination_blob_name}"


def transcribe_audio(gcs_uri, client, config, max_retries=5):
    """
    Transcribes audio from a GCS URI using Google Cloud's Speech-to-Text API.

    :param gcs_uri: GCS URI of the audio file.
    :param client: Initialized Google Cloud Speech client.
    :param config: RecognitionConfig object.
    :param max_retries: Maximum number of retries for transient errors.
    :return: Dictionary containing the full transcript and segments with speaker info.
    """
    attempt = 0
    while attempt < max_retries:
        try:
            print(f"Starting transcription for: {gcs_uri}")
            operation = client.long_running_recognize(config=config, audio={"uri": gcs_uri})
            operation_name = operation.operation.name
            print(f"Operation Name: {operation_name}")
            print("Waiting for transcription to complete...")

            # Optionally, implement periodic status checks
            while not operation.done():
                print("Transcription in progress...")
                time.sleep(60)  # Wait for 60 seconds before checking again

            response = operation.result(timeout=7200)  # 2 hours timeout

            full_transcript = ""
            segments = []
            for result in response.results:
                alternative = result.alternatives[0]
                full_transcript += alternative.transcript + " "

            # Speaker diarization
            if response.results:
                result = response.results[-1]
                if result.alternatives and result.alternatives[0].words:
                    words_info = result.alternatives[0].words
                    current_speaker = words_info[0].speaker_tag
                    segment_text = ""
                    start_time = words_info[0].start_time.total_seconds()
                    for word_info in words_info:
                        if word_info.speaker_tag != current_speaker:
                            end_time = word_info.start_time.total_seconds()
                            segments.append({
                                "text": segment_text.strip(),
                                "start_time": start_time,
                                "end_time": end_time,
                                "speaker": f"Speaker {current_speaker}"
                            })
                            # Reset for the next speaker
                            current_speaker = word_info.speaker_tag
                            segment_text = ""
                            start_time = word_info.start_time.total_seconds()
                        segment_text += word_info.word + " "
                    # Add the last segment
                    end_time = words_info[-1].end_time.total_seconds()
                    segments.append({
                        "text": segment_text.strip(),
                        "start_time": start_time,
                        "end_time": end_time,
                        "speaker": f"Speaker {current_speaker}"
                    })

            return {"full_transcript": full_transcript.strip(), "segments": segments}

        except InvalidArgument as e:
            print(f"Invalid argument error for {gcs_uri}: {e}")
            return {"full_transcript": "", "segments": []}
        except RetryError as e:
            wait_time = 2 ** attempt
            print(f"Retryable error: {e}. Retrying in {wait_time} seconds...")
            time.sleep(wait_time)
            attempt += 1
        except GoogleAPICallError as e:
            wait_time = 2 ** attempt
            print(f"Google API call error: {e}. Retrying in {wait_time} seconds...")
            time.sleep(wait_time)
            attempt += 1
        except Exception as e:
            print(f"Non-retryable error during transcription of {gcs_uri}: {e}")
            return {"full_transcript": "", "segments": []}
    print(f"Failed to transcribe {gcs_uri} after {max_retries} attempts.")
    return {"full_transcript": "", "segments": []}

def parse_transcription(transcription_data):
    """
    Parses transcription data to extract text and metadata segments.

    :param transcription_data: Dictionary containing 'full_transcript' and 'segments'.
    :return: List of segments with metadata.
    """
    segments = transcription_data.get('segments', [])
    parsed_segments = []
    for segment in segments:
        parsed_segment = {
            "text": segment.get('text', ''),
            "start_time": segment.get('start_time', 0.0),
            "end_time": segment.get('end_time', 0.0),
            "speaker": segment.get('speaker', 'Unknown')  # Default to 'Unknown' if not provided
        }
        parsed_segments.append(parsed_segment)
    return parsed_segments

def save_results(full_transcript, segments, transcript_path, segments_path):
    """
    Saves the full transcript and segments to respective files.

    :param full_transcript: The complete transcribed text.
    :param segments: List of segments with metadata.
    :param transcript_path: Path to save the full transcript text file.
    :param segments_path: Path to save the segments JSON file.
    """
    # Save full transcript
    with open(transcript_path, "w", encoding="utf-8") as f:
        f.write(full_transcript)
    print(f"Full transcript saved to {transcript_path}")

    # Save segments
    with open(segments_path, "w", encoding="utf-8") as f:
        json.dump(segments, f, ensure_ascii=False, indent=4)
    print(f"Segments saved to {segments_path}")

def main():
    parser = argparse.ArgumentParser(description="Transcribe large MP3 files with speaker diarization using Google Speech-to-Text API.")
    parser.add_argument("input_mp3", help="Path to the input MP3 file.")
    parser.add_argument("output_txt", help="Path to the output transcript text file.")
    parser.add_argument("segments_output_json", help="Path to the output segments JSON file.")
    parser.add_argument("--bucket-name", required=True, help="Name of the Google Cloud Storage bucket.")
    parser.add_argument("--language", type=str, default="en-US", help="Language code of the audio (default: en-US).")
    parser.add_argument("--max-speakers", type=int, default=16, help="Maximum number of speakers (default: 2).")
    args = parser.parse_args()

    # Validate input file
    if not os.path.isfile(args.input_mp3):
        print(f"Input MP3 file does not exist: {args.input_mp3}")
        return

    # Initialize Google Cloud clients
    speech_client = speech.SpeechClient()

    # Upload the entire audio file to GCS
    destination_blob_name = f"transcriptions/{uuid.uuid4()}.mp3"
    gcs_uri = upload_to_gcs(args.bucket_name, args.input_mp3, destination_blob_name)

    # Configure recognition
    diarization_config = speech.SpeakerDiarizationConfig(
        enable_speaker_diarization=True,
        min_speaker_count=1,
        max_speaker_count=args.max_speakers
    )

    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.MP3,
        language_code=args.language,
        enable_automatic_punctuation=True,
        diarization_config=diarization_config,
        # sample_rate_hertz=16000,  # Optional: Let the API auto-detect
    )

    # Perform transcription
    transcription_data = transcribe_audio(gcs_uri, speech_client, config)

    # Parse transcription
    full_transcript = transcription_data.get("full_transcript", "")
    segments = parse_transcription(transcription_data)

    # Save results
    save_results(full_transcript, segments, args.output_txt, args.segments_output_json)

if __name__ == "__main__":
    main()
