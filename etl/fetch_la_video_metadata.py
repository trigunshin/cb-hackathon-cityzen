import requests
import json
import argparse
import sys
from typing import List, Dict

def fetch_meetings(api_url: str) -> List[Dict]:
    """
    Fetches meetings data from the specified API URL.

    Args:
        api_url (str): The API endpoint to fetch meetings data.

    Returns:
        List[Dict]: A list of meeting dictionaries.

    Raises:
        requests.HTTPError: If the HTTP request returned an unsuccessful status code.
        ValueError: If the response content is not valid JSON.
    """
    try:
        print(f"Fetching data from API: {api_url}")
        response = requests.get(api_url)
        response.raise_for_status()  # Raises HTTPError for bad responses (4xx or 5xx)
    except requests.RequestException as e:
        print(f"Error fetching data from API: {e}")
        sys.exit(1)

    try:
        data = response.json()
        print("Data fetched successfully.")
    except ValueError as e:
        print(f"Error parsing JSON response: {e}")
        sys.exit(1)

    # Check if data is a list
    if isinstance(data, list):
        meetings = data
    elif isinstance(data, dict):
        # If data is a dict, attempt to extract list from values
        meetings = list(data.values())
    else:
        print(f"Unexpected JSON structure: {type(data)}")
        sys.exit(1)

    print(f"Total meetings fetched: {len(meetings)}")
    return meetings

def filter_meetings(meetings: List[Dict]) -> List[Dict]:
    """
    Filters meetings that have a videoUrl and do not have '- SAP' in the title.

    Args:
        meetings (List[Dict]): The list of meeting dictionaries.

    Returns:
        List[Dict]: The filtered list of meeting dictionaries.
    """
    filtered = []
    for meeting in meetings:
        video_url = meeting.get("videoUrl")
        title = meeting.get("title", "")
        if video_url and "- SAP" not in title:
            filtered.append(meeting)
    print(f"Meetings after filtering: {len(filtered)}")
    return filtered

def extract_relevant_fields(meetings: List[Dict]) -> List[Dict]:
    """
    Extracts relevant fields from each meeting.

    Args:
        meetings (List[Dict]): The list of filtered meeting dictionaries.

    Returns:
        List[Dict]: The list of dictionaries with extracted fields.
    """
    extracted = []
    for meeting in meetings:
        record = {
            "videoUrl": meeting.get("videoUrl"),
            "title": meeting.get("title"),
            "id": meeting.get("id"),
            "meetingTypeId": meeting.get("meetingTypeId"),
            "committeeId": meeting.get("committeeId"),
            "dateTime": meeting.get("dateTime"),
            "date": meeting.get("date"),
            "time": meeting.get("time"),
            "allowPublicComment": meeting.get("allowPublicComment")
        }
        extracted.append(record)
    print(f"Extracted {len(extracted)} records with relevant fields.")
    return extracted

def write_to_file(data: List[Dict], file_path: str):
    """
    Writes the data to a JSON file.

    Args:
        data (List[Dict]): The list of meeting records to write.
        file_path (str): The path to the output JSON file.

    Raises:
        IOError: If there is an error writing to the file.
    """
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print(f"Data successfully written to {file_path}")
    except IOError as e:
        print(f"Error writing data to file: {e}")
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="Fetch and filter archived meetings with video URLs.")
    parser.add_argument(
        "-o", "--output",
        type=str,
        required=True,
        help="Path to the output JSON file."
    )
    parser.add_argument(
        "-y", "--year",
        type=int,
        default=2024,
        help="Year for which to fetch archived meetings. Default is 2024."
    )
    args = parser.parse_args()

    api_url = f"https://lacity.primegov.com/api/v2/PublicPortal/ListArchivedMeetings?year={args.year}"
    output_file = args.output

    meetings = fetch_meetings(api_url)
    filtered_meetings = filter_meetings(meetings)
    extracted_data = extract_relevant_fields(filtered_meetings)
    write_to_file(extracted_data, output_file)

if __name__ == "__main__":
    main()
