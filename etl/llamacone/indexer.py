from llama_index.core import VectorStoreIndex, StorageContext, ServiceContext
from llama_index.embeddings.openai import OpenAIEmbedding
from llamacone.utils import return_pinecone_index, return_pinecone_vectorstore


def index_documents(documents, namespace):

    embed_model = OpenAIEmbedding(model="text-embedding-3-large")
    vector_store = return_pinecone_vectorstore(namespace)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    pinecone_index = return_pinecone_index()

    # Generate embeddings and store in Pinecone
    VectorStoreIndex.from_documents(
        documents,
        storage_context=storage_context,
        embed_model=embed_model
    )

    # Verify embeddings
    index_stats = pinecone_index.describe_index_stats()
    print(index_stats)

    return True

