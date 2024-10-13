from llama_index.core import VectorStoreIndex, StorageContext, get_response_synthesizer
from llama_index.core.query_engine import RouterQueryEngine
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.selectors import LLMSingleSelector
from .utils import return_pinecone_vectorstore
from enum import Enum
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.query_engine import RetrieverQueryEngine


class namespaces(str, Enum):
    news = "news"
    youtube_city_council_la = "youtube_city_council_la"
    transcript_youtube = "transcripts_youtube"
    transcripts = "transcripts"
    events = "events"


def gen_query_eng(name):
    embed_model = OpenAIEmbedding(model="text-embedding-3-large")
    vector_store = return_pinecone_vectorstore(name)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)

    index = VectorStoreIndex.from_vector_store(
        vector_store=vector_store,
        storage_context=storage_context,
        embed_model=embed_model,
    )

    # configure retriever
    retriever = VectorIndexRetriever(
        index=index,
        similarity_top_k=10,
    )

    # configure response synthesizer
    response_synthesizer = get_response_synthesizer(
        response_mode="tree_summarize",
    )

    # assemble query engine
    query_engine = RetrieverQueryEngine(
        retriever=retriever,
        response_synthesizer=response_synthesizer,
    )

    return query_engine

def query_pinecone(query):
    news_query_engine = gen_query_eng("news")
    city_council_la_query_engine = gen_query_eng("youtube_city_council_la")
    #transcripts_query_engine = gen_query_eng("transcripts")
    transcript_youtube_query_engine = gen_query_eng("transcripts_youtube")
    #events_engine = gen_query_eng("events")

    query_engine_tools = [
        QueryEngineTool(
            query_engine=news_query_engine,
            metadata=ToolMetadata(
                description="Provides information about the latest news articles."
            ),
        ),
        #QueryEngineTool(
        #    query_engine=events_engine,
        #    metadata=ToolMetadata(
        #        description="Provides information about events."
        #    ),
        #),
        QueryEngineTool(
            query_engine=city_council_la_query_engine,
            metadata=ToolMetadata(
                description="Provides information about city council meetings."
            ),
        ),
        #QueryEngineTool(
        #    query_engine=transcripts_query_engine,
        #    metadata=ToolMetadata(
        #        description="Provides information about transcripts"
        #    ),
        #),
        QueryEngineTool(
            query_engine=transcript_youtube_query_engine,
            metadata=ToolMetadata(
                description="Provides information about transcripts from youtube"
            ),
        ),
    ]
    query_engine = RouterQueryEngine(
        selector=LLMSingleSelector.from_defaults(),
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
