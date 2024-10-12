import os
from bs4 import BeautifulSoup
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Pinecone as PineconeVectorStore
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from pinecone import Pinecone

OPENAI_API_KEY=os.getenv("openai_api_key")
PINECONE_API_KEY=os.getenv("pinecone_api_key")
PINECONE_INDEX_NAME=os.getenv("pinecone_api_key")

# Initialize Pinecone instance with your API key
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)

# Step 1: Load and parse the HTML file with BeautifulSoup
with open("/Users/pcrane/src/cb-hackathon-cityzen/etl/data/03032021_jou.html", "r", errors='ignore') as file:
    soup = BeautifulSoup(file, "html.parser")
    text_content = soup.get_text()  # Extract the raw text

chunk_size = 1000  # Adjust based on needs and size constraints
text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=100)
chunks = text_splitter.split_text(text_content)

# Step 2: Convert text to Document format for LangChain
documents = [
    Document(page_content=chunk, metadata={"source": "03032021_jou.html", "chunk": i, "total_chunks": len(chunks)})
    for i, chunk in enumerate(chunks)
]

# Step 4: Embed and store each chunk in Pinecone
embedding_model = OpenAIEmbeddings(api_key=OPENAI_API_KEY, model="text-embedding-3-large")

# Use the updated class method from the new langchain-pinecone package
pinecone_index = PineconeVectorStore.from_documents(documents, embedding_model, index_name=PINECONE_INDEX_NAME)
