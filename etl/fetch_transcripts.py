import requests
from pprint import pp
from youtube_transcript_api import YouTubeTranscriptApi


def fetch_meetings_data(year, committee="City Council Meeting"):
    url = f'https://lacity.primegov.com/api/v2/PublicPortal/ListArchivedMeetings?year={year}'

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')

    return [i for i in data if i['title'] == committee and i['videoUrl'] is not None]


def fetch_transcript(video_id):
    return YouTubeTranscriptApi.get_transcript(video_id)


def fetch_agenda_by_template_id(template_id):
    url = f'https://lacity.primegov.com/Portal/Meeting?meetingTemplateId={template_id}'

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return data
    except requests.exceptions.HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')


if __name__ == '__main__':
    year = 2024
    meetings_data = fetch_meetings_data(year)
    if meetings_data:
        pp(meetings_data)
    pp(fetch_transcript(meetings_data[1]['videoUrl'].split('v=', True)[1]))