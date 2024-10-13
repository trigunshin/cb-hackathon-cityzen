from pinecone import Pinecone
from llama_index.core import Document, VectorStoreIndex, StorageContext
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.vector_stores.pinecone import PineconeVectorStore
from models.transcript_data import RawTranscriptData
from db import Session
import os
from dotenv import load_dotenv

load_dotenv()

pinecone_api_key = os.environ["PINECONE_API_KEY"]
openai_api_key = os.environ["OPENAI_API_KEY"]

pc = Pinecone(api_key=pinecone_api_key)

print(pc.list_indexes())

embed_model = OpenAIEmbedding(model="text-embedding-3-large")
pinecone_index = pc.Index('cityzen-text-embedding-3-large', host='cityzen-text-embedding-3-large-n4dml80.svc.aped-4627-b74a.pinecone.io')

# Set up embedding model and vector store
vector_store = PineconeVectorStore(pinecone_index=pinecone_index)
storage_context = StorageContext.from_defaults(vector_store=vector_store)

session = Session()
transcripts = session.query(RawTranscriptData).limit(10).all()
# Create Document objects with metadata
documents = []
for idx, row in enumerate([i for i in transcripts]):
    text = row.transcript_text
    metadata = {
        'meeting_id': row.json_metadata['id'],
        'videoUrl': row.json_metadata['videoUrl'],
        'date': row.json_metadata['date'],
    }
    doc = Document(text=text, metadata=metadata)
    print(doc)
    documents.append(doc)

# Generate embeddings and store in Pinecone
index = VectorStoreIndex.from_documents(
    documents,
    storage_context=storage_context,
    embed_model=embed_model,
    verbose=True
)

# Verify embeddings
index_stats = pinecone_index.describe_index_stats()
print(index_stats)

query_engine = index.as_query_engine()
response = query_engine.query("What are the meeting notes about?")

print(response)