from fastapi import FastAPI, Query, HTTPException
from llamacone.query import query_pinecone
from typing import Annotated
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

HOST = '127.0.0.1'
PORT = '5000'

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/query')
def get_query(
    query: Annotated[str, Query(title="User query")]
):
    query_response = query_pinecone(query)
    json_response = transform_node_to_json(query_response)
    return json_response

def transform_node_to_json(query_response):
    if query_response:
        output = {
            "response": query_response.response
        }
        node_list = []
        for source_node in query_response.source_nodes:
            node_info = source_node.node
            node_output = {}
            node_output["id_"] = node_info.id_
            node_output["data"] = node_info.extra_info
            node_output["text"] = node_info.text if node_info.text else ""
            node_output["relationships"] = []
            for rel in node_info.relationships.values():
                rel_output = {}
                rel_output["node_id"] = rel.node_id
                rel_output["data"] = rel.metadata if rel.metadata  else {} 
                node_output["relationships"].append(rel_output)
            node_list.append(node_output)
        output["nodes"] = node_list
        return output
    
    else:
        return HTTPException(status_code=404, detail="Nothing found in documents")

# Run app
if __name__ == "__main__":
    uvicorn.run('main:app', host=HOST, port=int(PORT), reload=True, log_level="debug")