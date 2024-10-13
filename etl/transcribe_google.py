import os
import argparse
import json
import tempfile
from google.cloud import speech
from pydub import AudioSegment
from tqdm import tqdm

def transcribe_speech(audio_path, language_code="en-US"):
    """
    Transcribes speech from an audio file with speaker diarization.

    :param audio_path: Path to the audio file.
    :param language_code: Language code of the audio (default: "en-US").
    :return: Dictionary containing the full transcript and segments with speaker info.
    """
    client = speech.SpeechClient()

    # Load audio file
    with open(audio_path, "rb") as f:
        audio_content = f.read()

    audio = speech.RecognitionAudio(content=audio_content)

    # Configure diarization
    diarization_config = speech.SpeakerDiarizationConfig(
        enable_speaker_diarization=True,
        min_speaker_count=1,
        max_speaker_count=16,  # Adjust based on expected number of speakers
    )

    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.MP3,
        sample_rate_hertz=16000,  # Ensure this matches your audio file's sample rate
        language_code=language_code,
        enable_automatic_punctuation=True,
        diarization_config=diarization_config,
    )

    print(f"Transcribing audio file: {audio_path}")

    operation = client.long_running_recognize(config=config, audio=audio)

    print("Waiting for transcription to complete...")
    response = operation.result(timeout=600)  # Adjust timeout as needed

    full_transcript = ""
    segments = []

    for result in response.results:
        alternative = result.alternatives[0]
        full_transcript += alternative.transcript

    # Speaker diarization results
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

    return {"full_transcript": full_transcript, "segments": segments}

def save_transcription(transcript_data, transcript_path, segments_path):
    """
    Saves the full transcript and segments to respective files.

    :param transcript_data: Dictionary containing 'full_transcript' and 'segments'.
    :param transcript_path: Path to save the full transcript text file.
    :param segments_path: Path to save the segments JSON file.
    """
    # Save full transcript
    with open(transcript_path, "w", encoding="utf-8") as f:
        f.write(transcript_data["full_transcript"])
    print(f"Full transcript saved to {transcript_path}")

    # Save segments
    with open(segments_path, "w", encoding="utf-8") as f:
        json.dump(transcript_data["segments"], f, ensure_ascii=False, indent=4)
    print(f"Segments saved to {segments_path}")

def main():
    parser = argparse.ArgumentParser(description="Transcribe MP3 files with speaker diarization using Google Speech-to-Text API.")
    parser.add_argument("input_mp3", help="Path to the input MP3 file.")
    parser.add_argument("output_txt", help="Path to the output transcript text file.")
    parser.add_argument("segments_output_json", help="Path to the output segments JSON file.")
    parser.add_argument("--language", type=str, default="en-US", help="Language code of the audio (default: en-US).")
    args = parser.parse_args()

    # Optional: Convert audio to 16kHz mono if needed
    # Google recommends 16kHz, but can handle higher rates
    audio = AudioSegment.from_file(args.input_mp3)
    audio = audio.set_frame_rate(16000).set_channels(1)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio_file:
        audio.export(temp_audio_file.name, format="mp3")
        temp_audio_path = temp_audio_file.name

    try:
        transcript_data = transcribe_speech(temp_audio_path, language_code=args.language)
        save_transcription(transcript_data, args.output_txt, args.segments_output_json)
    finally:
        # Clean up temporary audio file
        os.remove(temp_audio_path)
        print(f"Deleted temporary file: {temp_audio_path}")

if __name__ == "__main__":
    main()
