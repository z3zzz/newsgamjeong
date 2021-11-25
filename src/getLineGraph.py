import pymongo
import json
from pprint import pprint

## 필수!! db, col 이름 변수 설정
db_name = 'result'
col_name = 'graph'

connection = pymongo.MongoClient("mongodb://localhost:27017/")
db = connection.get_database(db_name)
col = db.get_collection(col_name)

def getLineGraphData(request_month):
    result = []
    for c in col.find({}):
        if int(c["time"][5:7]) == request_month:
            temp = {}
            temp[c["time"]] = c["count"]
            result.append(temp)

        last_month = int(c["time"][5:7])
    if not result:
        if request_month < last_month:
            for c in col.find({}):
                if int(c["time"][5:7]) == 1:
                    temp = {}
                    temp[c["time"]] = c["count"]
                    result.append(temp)
            return {"result":"fail", "reason": "이전의 데이터는 없습니다", "data": result}
        else:
            for c in col.find({}):
                if int(c["time"][5:7]) == last_month:
                    temp = {}
                    temp[c["time"]] = c["count"]
                    result.append(temp)
            return {"result":"fail", "reason": "이후의 데이터는 없습니다", "data": result}
    return {"result": "success", "data": result}

'''
테스트용
pprint(getLineGraphData(1))
'''
