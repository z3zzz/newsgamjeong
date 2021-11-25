import pymongo
import json
from pprint import pprint

## 필수!! db, col 이름 변수 설정
db_name = 'practice'
col_name = 'yeardream'

connection = pymongo.MongoClient("mongodb://localhost:27017/")
db = connection.get_database(db_name)
col = db.get_collection(col_name)

def getSelectors():
    selectors = {"date": {}, "category":{}, "company": {}}
    for c in col.find():
        news_date = c['time'][:10]
        news_category = c['category']
        news_company = c['text_company']

        if news_date not in selectors["date"]:
            selectors["date"][news_date] = 1
        else:
            selectors["date"][news_date] += 1

        if news_category not in selectors["category"]:
            selectors["category"][news_category] = 1
        else:
            selectors["category"][news_category] += 1

        if news_company not in selectors["company"]:
            selectors["company"][news_company] = 1
        else:
            selectors["company"][news_company] += 1

    return selectors
