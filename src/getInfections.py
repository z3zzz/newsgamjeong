import pymongo
import json
from pprint import pprint

## 필수!! db, col 이름 변수 설정
db_name = 'result'
col_name = 'infections'

connection = pymongo.MongoClient("mongodb://localhost:27017/")
db = connection.get_database(db_name)
col = db.get_collection(col_name)

def getInfectionsData(request_month):
    # 임시 최대 월 지정하였음. 11월까지 꺾은선데이터 다 오면 아래 코드 지울 것
    if request_month > 5:
        request_month = 9999
    result = []
    for c in col.find({}):
        if int(c["Date"][5:7]) == request_month:
            result.append((c["Date"][:4]+"."+c["Date"][5:7]+"."+c["Date"][8:10], c["corona"]))
        last_month = int(c["Date"][5:7])
    if not result:
        ##임시 최대 월 지정하였음. 11월까지 꺾은선데이터 다 오면 아래 코드 지울 것
        last_month = 5
        if request_month < last_month:
            for c in col.find({}):
                if int(c["Date"][5:7]) == 1:
                    result.append((c["Date"][:4]+"."+c["Date"][5:7]+"."+c["Date"][8:10], c["corona"]))
            return {"result":"fail", "reason": "이전의 데이터는 없습니다", "data": sorted(result)}
        else:
            for c in col.find({}):
                if int(c["Date"][5:7]) == last_month:
                    result.append((c["Date"][:4]+"."+c["Date"][5:7]+"."+c["Date"][8:10], c["corona"]))
            return {"result":"fail", "reason": "이후의 데이터는 없습니다", "data": sorted(result)}

    return {"result": "success", "data": sorted(result)}

'''
테스트용
pprint(getInfectionsData(1))
'''
