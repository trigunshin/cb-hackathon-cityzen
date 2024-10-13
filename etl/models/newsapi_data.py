from sqlalchemy import Column, Integer, String, DateTime, func, JSON, Text
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass

class RawNewsApiData(Base): 
    __tablename__ = 'raw_newsapi_data'
    id = Column(Integer, primary_key=True, autoincrement=True) 
    json_response = Column(JSON) 
    transcript_text = Column(String)
    title = Column(String)
    body = Column(Text)
    source = Column(String)
    created_at = Column(DateTime, default=func.now())

RawNewsApiDataBase = Base