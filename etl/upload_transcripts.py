# upload_to_pinecone.py

import os
import json
import re
from pathlib import Path

from pinecone import Pinecone
from llama_index.core import Document
from llamacone.indexer import index_documents  # Ensure this is the correct import based on your llama_index version

# Configuration Constants
PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
PINECONE_ENVIRONMENT = os.getenv('PINECONE_ENVIRONMENT')
PINECONE_INDEX_NAME = os.getenv('PINECONE_INDEX_NAME')
pinecone_namespace = "youtube_city_council_la"

TRANSCRIPTS_DIR = Path('transcripts')
FETCHABLE_VIDEOS_FILE = Path('fetchable_videos/2024.json')
PINECONED_DIR = Path('pineconed')

# Initialize Pinecone
pinecone_client = Pinecone(api_key=PINECONE_API_KEY)

# Verify Pinecone index exists
print(f"indexes: {pinecone_client.list_indexes()}")

# Ensure pineconed directory exists
PINECONED_DIR.mkdir(exist_ok=True)


def extract_video_id(video_url):
    """
    Extracts the VIDEO_ID from a YouTube URL.
    Example: 'https://www.youtube.com/watch?v=VIDEO_ID' -> 'VIDEO_ID'
    """
    match = re.search(r'v=([A-Za-z0-9_-]{11})', video_url)
    if match:
        return match.group(1)
    return None


def extract_video_id_from_filename(filename):
    """
    Extracts VIDEO_ID from the transcript filename.
    Assumes filename format: VIDEO_ID.txt
    """
    return Path(filename).stem


def load_fetchable_videos(fetchable_videos_path):
    """
    Loads the fetchable_videos JSON file and returns a dict mapping VIDEO_ID to metadata.
    """
    with open(fetchable_videos_path, 'r') as f:
        videos = json.load(f)

    video_dict = {}
    for video in videos:
        video_url = video.get('videoUrl', '')
        video_id = extract_video_id(video_url)
        if video_id:
            video_dict[video_id] = video
        else:
            print(f"Warning: Could not extract VIDEO_ID from URL: {video_url}")
    return video_dict


def get_video_time_stats(metadata):
    """
    Extracts or computes video/time stats from metadata.
    Modify this function based on the actual structure of your metadata.
    """
    return {
        'id': metadata.get('id'),
        'videoUrl': metadata.get('videoUrl'),
        'duration_seconds': metadata.get('duration_seconds'),  # e.g., total duration
        'dateTime': metadata.get('dateTime'),  # e.g., transcript start time
        'view_count': metadata.get('view_count'),
        'like_count': metadata.get('like_count'),
        'title': metadata.get('title'),
        'meetingTypeId': metadata.get('meetingTypeId'),
        'committeeId': metadata.get('committeeId'),
        'generation': 1,
    }


def main():
    # Load video metadata
    video_metadata = load_fetchable_videos(FETCHABLE_VIDEOS_FILE)

    # Iterate over each transcript file
    for transcript_file in TRANSCRIPTS_DIR.glob('*.txt'):
        video_id = extract_video_id_from_filename(transcript_file.name)
        if not video_id:
            print(f"Skipping file with invalid format: {transcript_file.name}")
            continue

        # Check if VIDEO_ID has already been uploaded
        pineconed_file = PINECONED_DIR / f"{video_id}.json"
        if pineconed_file.exists():
            print(f"VIDEO_ID {video_id} already uploaded. Skipping.")
            continue

        # Retrieve metadata for the VIDEO_ID
        metadata = video_metadata.get(video_id)
        if not metadata:
            print(f"No metadata found for VIDEO_ID {video_id}. Skipping.")
            continue

        # Read transcript text
        try:
            with open(transcript_file, 'r', encoding='utf-8') as f:
                transcript_text = f.read()
        except Exception as e:
            print(f"Error reading {transcript_file}: {e}")
            continue

        # Enhance metadata with video/time stats
        video_stats = get_video_time_stats(metadata)
        metadata.update(video_stats)

        # Create a llama_index Document
        doc = Document(text=transcript_text, metadata=metadata)

        # Upsert Document to Pinecone using llama_index
        try:
            index_documents([doc], namespace=pinecone_namespace)
            print(f"Successfully uploaded VIDEO_ID {video_id} to Pinecone.")

            # Mark as uploaded by creating an empty JSON file
            pineconed_file.touch()
        except Exception as e:
            print(f"Failed to upload VIDEO_ID {video_id}: {e}")


if __name__ == "__main__":
    main()

