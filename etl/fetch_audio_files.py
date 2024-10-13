import os
import json
import re
import argparse
import sys
import logging
from pytubefix import YouTube
# from pytubefix.exceptions import PytubeError

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('download_youtube_audios.log')
    ]
)

def load_meetings(json_file: str) -> list:
    """
    Loads the meetings data from a JSON file.

    Args:
        json_file (str): Path to the JSON file.

    Returns:
        list: List of meeting dictionaries.
    """
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        meetings = []
        if isinstance(data, dict):
            meetings = list(data.values())
        elif isinstance(data, list):
            meetings = data
        else:
            logging.error(f"Unexpected JSON structure: {type(data)}")
            sys.exit(1)
        logging.info(f"Loaded {len(meetings)} meetings from {json_file}.")
        return meetings
    except FileNotFoundError:
        logging.error(f"The file {json_file} does not exist.")
        sys.exit(1)
    except json.JSONDecodeError as e:
        logging.error(f"Error decoding JSON: {e}")
        sys.exit(1)

def extract_video_id(video_url: str) -> str:
    """
    Extracts the YouTube video ID from a given URL.

    Args:
        video_url (str): The full YouTube video URL.

    Returns:
        str: The extracted video ID.

    Raises:
        ValueError: If the video ID cannot be extracted.
    """
    # Regular expression to extract YouTube video ID
    regex = r'(?:v=|\/)([0-9A-Za-z_-]{11}).*'
    match = re.search(regex, video_url)
    if match:
        return match.group(1)
    else:
        raise ValueError(f"Invalid YouTube URL: {video_url}")


def download_audio(video_id: str, output_dir: str):
    """
    Downloads a YouTube video's audio stream to the specified directory using the video ID as the filename.

    Args:
        video_id (str): The YouTube video ID.
        output_dir (str): The directory where the audio file will be saved.
    """
    try:
        yt_url = f"https://www.youtube.com/watch?v={video_id}"
        yt = YouTube(yt_url)
        # Select the highest bitrate audio-only stream
        audio_stream = yt.streams.filter(only_audio=True).order_by('abr').desc().first()
        if not audio_stream:
            logging.warning(f"No audio stream found for video ID: {video_id}")
            return

        # Determine the file extension based on the stream's MIME type
        mime_type = audio_stream.mime_type  # e.g., 'audio/webm'
        if 'webm' in mime_type:
            ext = '.webm'
        elif 'mp4' in mime_type:
            ext = '.mp4'
        elif 'm4a' in mime_type:
            ext = '.m4a'
        else:
            ext = '.mp3'  # Fallback extension

        # Define the output file path using video ID
        output_file = os.path.join(output_dir, f"{video_id}{ext}")

        # Check if file already exists
        if os.path.exists(output_file):
            logging.info(f"File '{output_file}' already exists. Skipping download.")
            return

        logging.info(f"Downloading audio for video ID '{video_id}'...")
        audio_stream.download(output_path=output_dir, filename=f"{video_id}{ext}")
        logging.info(f"Downloaded audio for video ID '{video_id}' successfully.")
    # except PytubeError as e:
    #     logging.error(f"PytubeError: Failed to download audio for video ID {video_id}: {e}")
    #     logging.debug(traceback.format_exc())
    except Exception as e:
        logging.error(f"Unexpected error: Failed to download audio for video ID {video_id}: {e}")


def main():
    parser = argparse.ArgumentParser(description="Download YouTube audio streams from a JSON file.")
    parser.add_argument(
        "-i", "--input",
        type=str,
        default="fetchable_videos/2024.json",
        help="Path to the input JSON file containing video URLs."
    )
    parser.add_argument(
        "-o", "--output",
        type=str,
        default="data",
        help="Directory where the downloaded audio files will be saved."
    )
    args = parser.parse_args()

    input_file = args.input
    output_dir = args.output

    # Ensure the output directory exists
    if not os.path.exists(output_dir):
        try:
            os.makedirs(output_dir)
            logging.info(f"Created output directory: {output_dir}")
        except OSError as e:
            logging.error(f"Error creating directory {output_dir}: {e}")
            sys.exit(1)

    # Load meetings data
    meetings = load_meetings(input_file)
    meetings.reverse()
    # Iterate over each meeting and download the audio

    for meeting in meetings[0:100]:
        video_url = meeting.get("videoUrl")
        if not video_url:
            logging.warning(f"Meeting ID {meeting.get('id')} does not have a video URL. Skipping.")
            continue
        try:
            video_id = extract_video_id(video_url)
            download_audio(video_id, output_dir)
        except ValueError as ve:
            logging.error(ve)
            continue

if __name__ == "__main__":
    main()
