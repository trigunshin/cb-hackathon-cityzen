# Contributing 

## Run Frontend
NextJS
`npm install`
`npm run dev`

## Run Backend 
Python

`brew install pipx`

`pipx install poetry`

`pipx install fastapi uvicorn`

`poetry shell`

`main.py`i

## Script Pull Steps:
`python3 fetch_la_video_metadata.py -o fetchable_videos/2024.json -y 2024`

`python3 fetch_audio_files.py`

`python3 transcribe_chunked_audio.py --chunk-length-min 5 --overlap-sec 1 --language en`


## TODO List
- [ ] Multithread the whisper transcription
- [ ] Fetch participants by adding templateId and fetching template (handle errors) (e.g. https://lacity.primegov.com/Portal/Meeting?meetingTemplateId=124589)
- [ ] Add unit tests for new features
- [ ] Improve error handling in the API
- [ ] Update user documentation
- [ ] Refactor code for better readability
- [ ] Optimize database queries
