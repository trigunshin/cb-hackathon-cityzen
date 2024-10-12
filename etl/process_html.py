import os
from bs4 import BeautifulSoup
from langchain.document_loaders import BSHTMLLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS  # Using FAISS as an example
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA

# Set your OpenAI API key
# Path to the API key file inside the container
api_key_file = "llm_api_key.txt"

OPENAI_API_KEY = None
# Read the API key
with open(api_key_file, 'r') as file:
    OPENAI_API_KEY = file.read().strip()

# Use the API key as needed
print("API Key loaded successfully.")
if not OPENAI_API_KEY:
    print("Please set the OPENAI_API_KEY environment variable.")
    exit(1)

# Path to the HTML file
html_file_path = 'data/03032021_jou.html'

# Load and parse the HTML file
loader = BSHTMLLoader(html_file_path)
documents = loader.load()

# Split documents into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
docs = text_splitter.split_documents(documents)

# Generate embeddings
embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)

# Use FAISS as the vector store (you can use Pinecone or others)
vectorstore = FAISS.from_documents(docs, embeddings)

# Create a retriever
retriever = vectorstore.as_retriever(search_kwargs={'k': 5})

# Set up the language model
llm = OpenAI(openai_api_key=OPENAI_API_KEY)

# Create the QA chain
qa_chain = RetrievalQA.from_chain_type(llm=llm, chain_type='stuff', retriever=retriever)

# Run a test query
query = "What were the main topics discussed in the council meeting on March 3, 2021?"
response = qa_chain.run(query)
print("Response:")
print(response)

