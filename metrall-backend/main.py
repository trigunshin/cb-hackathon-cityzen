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
    result = query_pinecone(query, 'news').source_nodes
    json_response = transform_node_to_json(result)
    return json_response

def transform_node_to_json(result):
    output_list = []
    for source_node in result:
        node_info = source_node.node
        output = {}
        output["title"] = node_info.extra_info["title"]
        output["source"] = node_info.extra_info["source"]
        output["date"] = node_info.extra_info["date"]
        output["sentiment"] = node_info.extra_info["sentiment"]
        output["image"] = node_info.extra_info["image"]
        output["text"] = node_info.text
        output_list.append(output)
    return output_list

# Run app
if __name__ == "__main__":
    uvicorn.run('main:app', host=HOST, port=int(PORT), reload=True, log_level="debug")