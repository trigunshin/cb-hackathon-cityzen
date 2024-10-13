from db import Session
from llama_index.core import Document
from models.newsapi_data import RawNewsApiData
from llamacone.indexer import index_documents

def load_news():
    session = Session()
    articles = session.query(RawNewsApiData).limit(100).all()

    documents = []
    for a in [i for i in articles]:
        text = f"{a.title}: {a.body}"
        metadata = {
            'title': a.json_response['title'],
            'source': a.source,
            'date': a.json_response['date'],
            'sentiment': a.json_response['sentiment'],
            'image': a.json_response['image'] if a.json_response['image'] else '',
        }
        doc = Document(text=text, metadata=metadata)
        print(doc)
        documents.append(doc)

    return documents

if __name__ == '__main__':
    docs = load_news()
    index_documents(docs, "news")