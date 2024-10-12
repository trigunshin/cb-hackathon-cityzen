from sqlalchemy import Column, Integer, String, DateTime, func, JSON
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass

class RawTranscriptData(Base): 
    __tablename__ = 'raw_transcript_data'
    id = Column(Integer, primary_key=True, autoincrement=True) 
    json_metadata = Column(JSON) 
    transcript_text = Column(String)
    source = Column(String)
    created_at = Column(DateTime, default=func.now())
    def __repr__(self) -> str:
        return f"RawJsonData(id={self.id!r}, content={self.content!r}, source={self.source!r}, created_at={self.created_at!r})"

RawTranscriptDataBase = Base