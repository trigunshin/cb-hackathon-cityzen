import json
from openai import OpenAI
client = OpenAI()

AUDIO_FILE_PATH="/Users/pcrane/src/cb-hackathon-cityzen/etl/data/la_4435d2c8-1dbc-4cfb-947b-72056244997f.mp3"
audio_file = open(AUDIO_FILE_PATH, "rb")
transcript = client.audio.transcriptions.create(
  file=audio_file,
  model="whisper-1",
  response_format="verbose_json",
  timestamp_granularities=["segment"],
  language="english"
)

with open('/Users/pcrane/src/cb-hackathon-cityzen/etl/data/transcript.json', 'w') as f:
    json.dump(transcript, f)
