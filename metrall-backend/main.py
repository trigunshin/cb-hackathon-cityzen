from fastapi import FastAPI, Query, HTTPException
from llamacone.query import query_pinecone
from typing import Annotated
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import uuid

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
            node_output["data"] = node_info.extra_info
            node_output["text"] = node_info.text if node_info.text else ""
            node_list.append({"node": node_output})

        grouped_nodes = de_duplicate(node_list)
        aggregated_results = aggregate_text(grouped_nodes)

        output["nodes"] = aggregated_results

        return output

    else:
        return HTTPException(status_code=404, detail="Nothing found in documents")


def de_duplicate(node_list):
    grouped = {}

    for source_item in node_list:
        node = source_item['node']
        title = node['data'].get('title', 'Unknown Title') 

        if title not in grouped:
            grouped[title] = []
        
        grouped[title].append(node)

    return grouped


def aggregate_text(grouped_nodes):
    aggregated_results = []
    
    for title, nodes in grouped_nodes.items():
        combined_text = " ".join(node['text'] for node in nodes)
        first_node = nodes[0]

        aggregated_results.append({
            "uuid": str(uuid.uuid4()),
            "title": title,
            "source": first_node['data'].get('source', 'Unknown Source'),
            "date": first_node['data'].get('date', 'Unknown Date'),
            "sentiment": first_node['data'].get('sentiment'),
            "text": combined_text,
            "image": first_node['data'].get('image', ''),
        })

    return aggregated_results


# Run app
if __name__ == "__main__":
    uvicorn.run('main:app', host=HOST, port=int(PORT), reload=True, log_level="debug")