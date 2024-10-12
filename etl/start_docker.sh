podman run -p 8888:8888 \
  -v llm_api_key.txt:/run/secrets/llm_api_key.txt:ro \
  llm

