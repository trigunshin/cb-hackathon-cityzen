from dotenv import load_dotenv
from eventregistry import EventRegistry, TopicPage
import os

load_dotenv()

ER_API_KEY = os.getenv('EVENT_REGISTRY_API_KEY')

er = EventRegistry(apiKey = ER_API_KEY)

t = TopicPage(er)
# load the topic page with the given uri
t.loadTopicPageFromER("46792d5b-20e7-441f-b0c4-5a71415ff740")

# retrieve the first page of 100 results. To get the next page, call with page=2, ...
res = t.getArticles(page = 1)
for art in res.get("articles", {}).get("results", []):
    print(art)