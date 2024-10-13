from fastapi import FastAPI, Query
from llamacone.query import query_pinecone
from typing import Annotated
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

HOST = '127.0.0.1'
PORT = '5000'

# Setup app and routes
app = FastAPI()
# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

@app.get('/query')
def get_query(
    query: Annotated[str, Query(title="User query")]
):
    result = query_pinecone(query).source_nodes
    json_response = transform_node_to_json(result)
    return json_response

def transform_node_to_json(result):
    output_list = []
    for source_node in result:
        node_info = source_node.node
        output = {}
        output["data"] = node_info.extra_info
        output["text"] = node_info.text if node_info.text else ""
        output_list.append(output)
    return output_list

# Run app
if __name__ == "__main__":
    uvicorn.run('main:app', host=HOST, port=int(PORT), reload=True, log_level="debug")