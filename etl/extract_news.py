from dotenv import load_dotenv
from eventregistry import EventRegistry, TopicPage
from models.newsapi_data import RawNewsApiData
from db import Session
import os

load_dotenv()

ER_API_KEY = os.getenv('EVENT_REGISTRY_API_KEY')

def extract_news_from_topic(topic_id):
    session = Session()

    er = EventRegistry(apiKey = ER_API_KEY)

    t = TopicPage(er)
    # load the topic page with the given uri
    t.loadTopicPageFromER(topic_id)

    # retrieve the first page of 100 results. To get the next page, call with page=2, ...
    for i in range(1,100):
        res = t.getArticles(page = i)
        for art in res.get("articles", {}).get("results", []):
            new_article = RawNewsApiData(
                json_response = art,
                title = art['title'],
                body = art['body'],
                source = f'newsapi topic page {topic_id}'
            )
            session.add(new_article)
            session.commit()
            print(art['title'])
        session.close()


if __name__ == '__main__':
    extract_news_from_topic("46792d5b-20e7-441f-b0c4-5a71415ff740")