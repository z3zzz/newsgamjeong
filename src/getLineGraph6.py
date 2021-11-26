import pymongo
import json
from pprint import pprint

## 필수!! db, col 이름 변수 설정
db_name = 'result'

connection = pymongo.MongoClient("mongodb://localhost:27017/")
db = connection.get_database(db_name)

def getLineGraph6Data(request_month, version):
    col_name = f'graph{version}'
    col = db.get_collection(col_name)

    result = []
    for c in col.find({}):
        for date in c.keys():
            if date == "_id":
                continue
            if int(date[5:7]) == request_month:
                temp = {}
                temp[date] = c[date]
                result.append(temp)

            last_month = int(date[5:7])
        if not result:
            if request_month < last_month:
                for c in col.find({}):
                    for date in c.keys():
                        if date == "_id":
                            continue
                        if int(date[5:7]) == 1:
                            temp = {}
                            temp[date] = c[date]
                            result.append(temp)
                    return {"result":"fail", "reason": "이전의 데이터는 없습니다", "data": result}
            else:
                for c in col.find({}):
                    for date in c.keys():
                        if date == "_id":
                            continue
                        if int(date[5:7]) == last_month:
                            temp = {}
                            temp[date] = c[date]
                            result.append(temp)
                    return {"result":"fail", "reason": "이후의 데이터는 없습니다", "data": result}
        return {"result": "success", "data": result}

'''
테스트용
pprint(getLineGraph6Data(4, 4))
'''
