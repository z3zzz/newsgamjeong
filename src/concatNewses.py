import pymongo
import json
from pprint import pprint

## 필수!! db, col 이름 변수 설정
db_name = 'result'
col_name = 'newses'

connection = pymongo.MongoClient("mongodb://localhost:27017/")
db = connection.get_database(db_name)
col = db.get_collection(col_name)
data = {}
for c in col.find({}):
    data[c["_id"]] = c["newses"]

# 1
def date_total_keyword_specific_company_specific(keyword, company):
    result = []
    for news_date in data.keys():
        for category in data[news_date].keys():
            if category == keyword:
                for news_company in data[news_date][category].keys():
                    if news_company == company:
                        result += data[news_date][category][news_company]
    return result

'''
코드 테스트용
pprint(date_total_keyword_specific_company_specific("오피니언", "조선일보"))
'''

# 2
def date_specific_keyword_total_company_specific(date, company):
    result = []
    for news_date in data.keys():
        if news_date == date:
            for category in data[news_date].keys():
                for news_company in data[news_date][category].keys():
                    if news_company == company:
                        result += data[news_date][category][news_company]
    return result

'''
코드 테스트용
pprint(date_specific_keyword_total_company_specific("2021.11.16", "조선일보"))
'''

# 3
def date_specific_keyword_specific_company_total(date, keyword):
    result = []
    for news_date in data.keys():
        if news_date == date:
            for category in data[news_date].keys():
                if category == keyword:
                    for news_company in data[news_date][category].keys():
                        result += data[news_date][category][news_company]
    return result

'''
코드 테스트용
pprint(date_specific_keyword_specific_company_total("2021.11.16", "경제"))
'''

# 4
def date_specific_keyword_total_company_total(date):
    result = []
    for news_date in data.keys():
        if news_date == date:
            for category in data[news_date].keys():
                for news_company in data[news_date][category].keys():
                    result += data[news_date][category][news_company]
    return result

'''
코드 테스트용
pprint(date_specific_keyword_total_company_total("2021.11.16"))
'''

# 5
def date_total_keyword_specific_company_total(keyword):
    result = []
    for news_date in data.keys():
        for category in data[news_date].keys():
            if category == keyword:
                for news_company in data[news_date][category].keys():
                    result += data[news_date][category][news_company]
    return result

'''
코드 테스트용
pprint(date_total_keyword_specific_company_total("경제"))
'''

# 6
def date_total_keyword_total_company_specific(company):
    result = []
    for news_date in data.keys():
        for category in data[news_date].keys():
            for news_company in data[news_date][category].keys():
                if news_company == company:
                    result += data[news_date][category][news_company]
    return result

'''
코드 테스트용
pprint(date_total_keyword_total_company_specific("조선일보"))
'''

# 7
def date_specific_keyword_specific_company_specific(date, keyword, company):
    return data[date][keyword][company]

'''
코드 테스트용
pprint(date_specific_keyword_specific_company_specific("2021.11.16","경제","조선일보"))
'''

# 8
def date_total_keyword_total_company_total():
    result = []
    for news_date in data.keys():
        for category in data[news_date].keys():
            for news_company in data[news_date][category].keys():
                result += data[news_date][category][news_company]
    return result
'''
코드 테스트용
pprint(date_total_keyword_total_company_total())
'''
