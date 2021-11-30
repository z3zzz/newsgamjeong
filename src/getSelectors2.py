import pymongo
import json
from pprint import pprint

## 필수!! db, col 이름 변수 설정
db_name = 'result'
col_name = 'practice10'

connection = pymongo.MongoClient("mongodb://localhost:27017/")
db = connection.get_database(db_name)
col = db.get_collection(col_name)

def getSelectors():
    selectors = {"date": {}, "category":{}, "company": {}}
    for c in col.find():
        news_date = c['날짜'][:10]
        news_category = c['키워드']
        news_company = c['언론사']

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
    '''
    selectors["category"]["정치"] = 0
    selectors["category"]["오피니언"] = 0
    selectors["category"]["세계"] = 0
    selectors["category"]["생활문화"] = 0
    selectors["category"]["사회"] = 0
    selectors["category"]["경제"] = 0

    '''

    for key in selectors.keys():
        selectors[key] = sorted(selectors[key].items())


    return selectors

'''
테스트용
print(getSelectors())
'''
