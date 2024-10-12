import os
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Pinecone as PineconeVectorStore

OPENAI_API_KEY=os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY=os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME=os.getenv("PINECONE_INDEX_NAME")

# Step 1: Set up the embedding model
embedding_model = OpenAIEmbeddings(model="text-embedding-3-large", api_key=OPENAI_API_KEY)

# Step 2: Define a user query
user_query = "What were the agenda items discussed on March 3, 2021?"

# Step 3: Embed the query
query_embedding = embedding_model.embed_query(user_query)

# step4:
pinecone_index = PineconeVectorStore.from_existing_index(index_name=PINECONE_INDEX_NAME, embedding=embedding_model)

# Step 5: Perform a similarity search on the Pinecone index using the text query
search_results = pinecone_index.similarity_search(user_query)

# Step 6: Display the search results
for i, result in enumerate(search_results, 1):
    print(f"Result {i}:")
    print(f"Source: {result.metadata['source']}")
    print(f"Content: {result.page_content[:50]}...")  # Displaying the first 500 characters for brevity
    print(f"Content Length: {len(result.page_content)}")
    print()










