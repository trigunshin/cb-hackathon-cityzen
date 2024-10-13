import os
from pinecone import Pinecone
from llama_index.vector_stores.pinecone import PineconeVectorStore
from dotenv import load_dotenv

load_dotenv()

pinecone_api_key = os.environ["PINECONE_API_KEY"]
openai_api_key = os.environ["OPENAI_API_KEY"]

pc = Pinecone(api_key=pinecone_api_key)

def return_pinecone_index(index_name='cityzen-text-embedding-3-large'):
    return pc.Index(index_name)

def return_pinecone_vectorstore(namespace):
    pinecone_index = pc.Index('cityzen-text-embedding-3-large', host='cityzen-text-embedding-3-large-n4dml80.svc.aped-4627-b74a.pinecone.io')
    #pinecone_index = return_pinecone_index()
    return PineconeVectorStore(pinecone_index=pinecone_index, namespace=namespace)