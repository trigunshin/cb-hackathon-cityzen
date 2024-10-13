from fastapi import FastAPI, Query, HTTPException
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
    result = query_pinecone(query)
    json_response = transform_node_to_json(result)
    return json_response

def transform_node_to_json(result):
    if result:
        output = {
            "response": result.response
        }
        node_list = []
        for source_node in result.source_nodes:
            node_info = source_node.node
            node_output = {}
            node_output["data"] = node_info.extra_info
            node_output["text"] = node_info.text if node_info.text else ""
            node_list.append(node_output)
        output["nodes"] = node_list
        return output
    else:
        return HTTPException(status_code=404, detail="Nothing found in documents")

# Run app
if __name__ == "__main__":
    uvicorn.run('main:app', host=HOST, port=int(PORT), reload=True, log_level="debug")