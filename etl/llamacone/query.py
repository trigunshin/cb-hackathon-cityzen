from llama_index.core import VectorStoreIndex, StorageContext, ServiceContext
from etl.llamacone.utils import return_pinecone_vectorstore

def query_pinecone(query, namespace):
    vector_store = return_pinecone_vectorstore(namespace)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    service_context = ServiceContext.from_defaults()

    index = VectorStoreIndex.from_vector_store(
        vector_store=vector_store,
        service_context=service_context,
        storage_context=storage_context
    )

    query_engine = index.as_query_engine()
    response = query_engine.query(query)

    return response

if __name__ == "__main__":
    response = query_pinecone("Can you summarize the documents?", namespace='transcripts')
    print(response)