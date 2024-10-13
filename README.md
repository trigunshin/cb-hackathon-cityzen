# cb-hackathon-cityzen
init the repo for citizen app for hackathon

script pull steps:
python3 fetch_la_video_metadata.py -o fetchable_videos/2024.json -y 2024
python3 fetch_transcripts.py
python3 transcribe_chunked_audio.py --chunk-length-min 5 --overlap-sec 1 --language en

## TODO List

- [ ] Multithread the whisper transcription
- [ ] Add unit tests for new features
- [ ] Improve error handling in the API
- [ ] Update user documentation
- [ ] Refactor code for better readability
- [ ] Optimize database queries

