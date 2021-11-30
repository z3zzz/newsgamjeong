import pymongo
import json
from pprint import pprint

## 필수!! db, col 이름 변수 설정
db_name = 'result'
col_name = 'practice10'

connection = pymongo.MongoClient("mongodb://localhost:27017/")
db = connection.get_database(db_name)
col = db.get_collection(col_name)

def supplement_ranking(news_ranking):
    positive_cnt = len(news_ranking["positive_ranking"])
    negative_cnt = len(news_ranking["negative_ranking"])
    normal_cnt = len(news_ranking["normal_ranking"])
    newses_cnt = len(news_ranking["number_of_newses"])

    if positive_cnt < 5:
        news_ranking["positive_ranking"] += [['',0]] * (5 - positive_cnt)
        news_ranking["negative_ranking"] += [['',0]] * (5 - negative_cnt)
        news_ranking["normal_ranking"] += [['',0]] * (5 - normal_cnt)
        for i in range(5 - newses_cnt):
            news_ranking["number_of_newses"][f'언론사 없음{i+1}'] = 0

    return news_ranking

def convert_count_to_ratio(result2):
    minimum_number, cnt = get_average_number_of_newses(result2)
    result3 = {"positive_ranking": [], "negative_ranking": [], "normal_ranking": [], "number_of_newses": {}, "criteria": minimum_number, "number_of_companies": cnt}

    for company in result2["positive_ranking"].keys():
        positive_count = result2["positive_ranking"][company]
        negative_count = result2["negative_ranking"][company]
        normal_count = result2["normal_ranking"][company]
        total = positive_count + negative_count + normal_count
        if total == 0:
            continue

        positive_ratio = (positive_count / total) * 100
        negative_ratio = (negative_count / total) * 100
        normal_ratio = (normal_count / total) * 100

        if total > minimum_number:
            result3["positive_ranking"].append([company,round(positive_ratio,1)])
            result3["negative_ranking"].append([company,round(negative_ratio,1)])
            result3["normal_ranking"].append([company,round(normal_ratio,1)])
            result3["number_of_newses"][company] = total


    result3["positive_ranking"] = sorted(result3["positive_ranking"], key=lambda x:x[1], reverse=True )[:5]
    result3["negative_ranking"] = sorted(result3["negative_ranking"], key=lambda x:x[1], reverse=True )[:5]
    result3["normal_ranking"] = sorted(result3["normal_ranking"], key=lambda x:x[1], reverse=True )[:5]

    return result3

def get_average_number_of_newses(result2):
    total = 0
    cnt = 0
    for company in result2["positive_ranking"].keys():
        positive_count = result2["positive_ranking"][company]
        negative_count = result2["negative_ranking"][company]
        normal_count = result2["normal_ranking"][company]

        total += positive_count + negative_count + normal_count
        cnt += 1

    print(total,cnt)
    return round(total / cnt), cnt


# 1
def date_total_keyword_specific_company_specific(keyword, company):
    result = {
        "total": 0,
        "positive": 0,
        "negative": 0,
        "normal": 0,
        "infections": 0
    }

    data = col.find_one({"날짜":"전체","키워드":keyword,"언론사":company})

    result["total"] += data["전체"]
    result["positive"] += data["긍정"]
    result["negative"] += data["부정"]
    result["normal"] += data["노말"]

    return result

'''
코드 테스트용
pprint(date_total_keyword_specific_company_specific("코로나", "조선일보"))
'''

# 2
def date_specific_keyword_total_company_specific(date, company):
    result = {
        "total": 0,
        "positive": 0,
        "negative": 0,
        "normal": 0,
        "infections": 0
    }
    data = col.find_one({"날짜":f'{date}.',"키워드":"전체","언론사":company})

    result["total"] += data["전체"]
    result["positive"] += data["긍정"]
    result["negative"] += data["부정"]
    result["normal"] += data["노말"]

    return result

'''
코드 테스트용
pprint(date_specific_keyword_total_company_specific("2021.08.01", "연합뉴스"))
'''

# 3
def date_specific_keyword_specific_company_total(date, keyword):
    result1 = {
        "total": 0,
        "positive": 0,
        "negative": 0,
        "normal": 0,
        "infections": 0,
    }
    result2 = {
        "positive_ranking": {},
        "negative_ranking": {},
        "normal_ranking": {},
    }

    datas = col.find({"날짜":f'{date}.',"키워드":keyword})

    for data in datas:
        news_company = data["언론사"]
        if news_company == "전체":
            continue
        result1["total"] += data["전체"]
        result1["positive"] += data["긍정"]
        result1["negative"] += data["부정"]
        result1["normal"] += data["노말"]

        if news_company not in result2["positive_ranking"]:
            result2["positive_ranking"][news_company] = data["긍정"]
        else:
            result2["positive_ranking"][news_company] += data["긍정"]

        if news_company not in result2["negative_ranking"]:
            result2["negative_ranking"][news_company] = data["부정"]
        else:
            result2["negative_ranking"][news_company] += data["부정"]

        if news_company not in result2["normal_ranking"]:
            result2["normal_ranking"][news_company] = data["노말"]
        else:
            result2["normal_ranking"][news_company] += data["노말"]

    result3 = convert_count_to_ratio(result2)

    result = {
        "statistics": result1,
        "news_ranking": result3,
    }

    result["news_ranking"] = supplement_ranking(result["news_ranking"])

    return result

'''
코드 테스트용
pprint(date_specific_keyword_specific_company_total("2021.01.09", "자영업"))
'''

# 4
def date_specific_keyword_total_company_total(date):
    result1 = {
        "total": 0,
        "positive": 0,
        "negative": 0,
        "normal": 0,
        "infections": 0
    }
    result2 = {
        "positive_ranking": {},
        "negative_ranking": {},
        "normal_ranking": {}
    }

    datas = col.find({"날짜":f'{date}.',"키워드":"전체"})

    for data in datas:
        news_company = data["언론사"]
        if news_company == "전체":
            continue

        result1["total"] += data["전체"]
        result1["positive"] += data["긍정"]
        result1["negative"] += data["부정"]
        result1["normal"] += data["노말"]

        if news_company not in result2["positive_ranking"]:
            result2["positive_ranking"][news_company] = data["긍정"]
        else:
            result2["positive_ranking"][news_company] += data["긍정"]

        if news_company not in result2["negative_ranking"]:
            result2["negative_ranking"][news_company] = data["부정"]
        else:
            result2["negative_ranking"][news_company] += data["부정"]

        if news_company not in result2["normal_ranking"]:
            result2["normal_ranking"][news_company] = data["노말"]
        else:
            result2["normal_ranking"][news_company] += data["노말"]

    result3 = convert_count_to_ratio(result2)

    result = {
        "statistics": result1,
        "news_ranking": result3
    }

    result["news_ranking"] = supplement_ranking(result["news_ranking"])

    return result

'''
코드 테스트용
'''
pprint(date_specific_keyword_total_company_total("2021.01.02"))

# 5
def date_total_keyword_specific_company_total(keyword):
    result1 = {
        "total": 0,
        "positive": 0,
        "negative": 0,
        "normal": 0,
        "infections": 0
    }
    result2 = {
        "positive_ranking": {},
        "negative_ranking": {},
        "normal_ranking": {}
    }

    datas = col.find({"키워드":keyword, "날짜":"전체"})

    for data in datas:
        news_company = data["언론사"]
        if news_company == "전체":
            continue

        result1["total"] += data["전체"]
        result1["positive"] += data["긍정"]
        result1["negative"] += data["부정"]
        result1["normal"] += data["노말"]

        if news_company not in result2["positive_ranking"]:
            result2["positive_ranking"][news_company] = data["긍정"]
        else:
            result2["positive_ranking"][news_company] += data["긍정"]

        if news_company not in result2["negative_ranking"]:
            result2["negative_ranking"][news_company] = data["부정"]
        else:
            result2["negative_ranking"][news_company] += data["부정"]

        if news_company not in result2["normal_ranking"]:
            result2["normal_ranking"][news_company] = data["노말"]
        else:
            result2["normal_ranking"][news_company] += data["노말"]

    result3 = convert_count_to_ratio(result2)

    result = {
        "statistics": result1,
        "news_ranking": result3
    }

    result["news_ranking"] = supplement_ranking(result["news_ranking"])

    return result

'''
코드 테스트용
'''
pprint(date_total_keyword_specific_company_total("코로나"))

# 6
def date_total_keyword_total_company_specific(company):
    result = {
        "total": 0,
        "positive": 0,
        "negative": 0,
        "normal": 0,
        "infections": 0
    }

    data = col.find_one({"날짜":"전체","키워드":"전체","언론사":company})

    result["total"] += data["전체"]
    result["positive"] += data["긍정"]
    result["negative"] += data["부정"]
    result["normal"] += data["노말"]

    return result

'''
코드 테스트용
pprint(date_total_keyword_total_company_specific("조선일보"))
'''

# 7
def date_specific_keyword_specific_company_specific(date, keyword, company):
    result = {
        "total": 0,
        "positive": 0,
        "negative": 0,
        "normal": 0,
        "infections": 0
    }

    data = col.find_one({"날짜":f'{date}.',"키워드": keyword,"언론사":company})

    result["total"] += data["전체"]
    result["positive"] += data["긍정"]
    result["negative"] += data["부정"]
    result["normal"] += data["노말"]

    return result

'''
코드 테스트용
pprint(date_specific_keyword_specific_company_specific("2021.08.11","부동산","조선일보"))
'''

# 8
def date_total_keyword_total_company_total():
    result1 = {
        "total": 0,
        "positive": 0,
        "negative": 0,
        "normal": 0,
        "infections": 0
    }
    result2 = {
        "positive_ranking": {},
        "negative_ranking": {},
        "normal_ranking": {}
    }


    datas = col.find({"키워드":"전체"})

    for data in datas:
        news_company = data["언론사"]
        if news_company == "전체" or data["날짜"] == "전체":
            continue

        result1["total"] += data["전체"]
        result1["positive"] += data["긍정"]
        result1["negative"] += data["부정"]
        result1["normal"] += data["노말"]

        if news_company not in result2["positive_ranking"]:
            result2["positive_ranking"][news_company] = data["긍정"]
        else:
            result2["positive_ranking"][news_company] += data["긍정"]

        if news_company not in result2["negative_ranking"]:
            result2["negative_ranking"][news_company] = data["부정"]
        else:
            result2["negative_ranking"][news_company] += data["부정"]

        if news_company not in result2["normal_ranking"]:
            result2["normal_ranking"][news_company] = data["노말"]
        else:
            result2["normal_ranking"][news_company] += data["노말"]

    result3 = convert_count_to_ratio(result2)

    result = {
        "statistics": result1,
        "news_ranking": result3
    }

    return result

'''
코드 테스트용
pprint(date_total_keyword_total_company_total())
'''
