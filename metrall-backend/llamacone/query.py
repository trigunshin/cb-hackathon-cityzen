from llama_index.core.query_engine import RouterQueryEngine
from llama_index.core.selectors import LLMMultiSelector
from enum import Enum
from .query_tools import query_engine_tools

class namespaces(str, Enum):
    news = "news"
    youtube_city_council_la = "youtube_city_council_la"
    transcript_youtube = "transcripts_youtube"
    transcripts = "transcripts"
    events = "events"

def query_pinecone(query):
    query_engine = RouterQueryEngine(
        selector=LLMMultiSelector.from_defaults(),
        query_engine_tools=query_engine_tools,
        verbose=True
    )
    response = query_engine.query(query)

    return response

if __name__ == "__main__":
    response = query_pinecone(
        "Can you summarize the documents?"
    )
    print(response)

    yt = gen_query_eng("transcripts_youtube")
    print(yt.query("Can you summarize the documents?"))