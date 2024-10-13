from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.embeddings.openai import OpenAIEmbedding
from .utils import return_pinecone_vectorstore
from enum import Enum

class namespaces(str, Enum):
    news = 'news'
    transcript_youtube = 'transcripts_youtube'
    transcripts = 'transcripts'
    events = 'events'

def query_pinecone(query, namespace: namespaces):
    embed_model = OpenAIEmbedding(model="text-embedding-3-large")
    vector_store = return_pinecone_vectorstore(namespace)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)

    index = VectorStoreIndex.from_vector_store(
        vector_store=vector_store,
        storage_context=storage_context,
        embed_model=embed_model
    )

    query_engine = index.as_query_engine()
    response = query_engine.query(query)

    return response

if __name__ == "__main__":
    response = query_pinecone("Can you summarize the documents?", namespace='transcripts')
    print(response)