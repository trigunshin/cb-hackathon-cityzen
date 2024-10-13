from fastapi import FastAPI, Query
from llamacone.query import query_pinecone
from typing import Annotated
import uvicorn

HOST = '127.0.0.1'
PORT = '5000'

# Setup app and routes
app = FastAPI()

@app.get('/query')
def get_query(
    query: Annotated[str, Query(title="User query")]
):
    return query_pinecone(query, 'transcripts_youtube')['response']


# Run app
if __name__ == "__main__":
    uvicorn.run('main:app', host=HOST, port=int(PORT), reload=True, log_level="debug")
