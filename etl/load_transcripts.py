from db import Session
from llama_index.core import Document
from models.transcript_data import RawTranscriptData
from llamacone.indexer import index_documents

def load_transcripts():
    session = Session()
    transcripts = session.query(RawTranscriptData).all()

    documents = []
    for row in [i for i in transcripts]:
        text = row.transcript_text
        metadata = {
            'meeting_id': row.json_metadata['id'],
            'videoUrl': row.json_metadata['videoUrl'],
            'date': row.json_metadata['date'],
        }
        doc = Document(text=text, metadata=metadata)
        print(doc)
        documents.append(doc)
    return documents

if __name__ == '__main__':
    docs = load_transcripts()
    index_documents(docs, "transcripts_youtube")