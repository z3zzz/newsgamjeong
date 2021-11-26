import pymongo
import json
from pprint import pprint

## 필수!! db, col 이름 변수 설정
db_name = 'result'
col_name = 'parts'

connection = pymongo.MongoClient("mongodb://localhost:27017/")
db = connection.get_database(db_name)
col = db.get_collection(col_name)
data = {}
for c in col.find({}):
    for key in c.keys():
        if key != "_id":
            data[key] = c[key]

def convert_count_to_ratio(result2):
    result3 = {"positive_ranking": [], "negative_ranking": [], "normal_ranking": [], "number_of_newses": []}
    minimum_number = 10

    for company in result2["positive_ranking"].keys():
        positive_count = result2["positive_ranking"][company]
        negative_count = result2["negative_ranking"][company]
        normal_count = result2["normal_ranking"][company]
        total = positive_count + negative_count + normal_count

        positive_ratio = (positive_count / total) * 100
        negative_ratio = (negative_count / total) * 100
        normal_ratio = (normal_count / total) * 100

        if total > minimum_number:
            result3["positive_ranking"].append([company,round(positive_ratio,1)])
            result3["negative_ranking"].append([company,round(negative_ratio,1)])
            result3["normal_ranking"].append([company,round(normal_ratio,1)])
            result3["number_of_newses"].append([company, total])


    result3["positive_ranking"] = sorted(result3["positive_ranking"], key=lambda x:x[1], reverse=True )[:5]
    result3["negative_ranking"] = sorted(result3["negative_ranking"], key=lambda x:x[1], reverse=True )[:5]
    result3["normal_ranking"] = sorted(result3["normal_ranking"], key=lambda x:x[1], reverse=True )[:5]

    return result3

# 1
def date_total_keyword_specific_company_specific(keyword, company):
    result = {
        "total": 0,
        "positive": 0,
        "negative": 0,
        "normal": 0,
        "infections": 0
    }
    for news_date in data.keys():
        infection_flag = 0
        for category in data[news_date].keys():
            if category == keyword:
                for news_company in data[news_date][category].keys():
                    if news_company == company:
                        result["total"] += data[news_date][category][news_company]["total"]
                        result["positive"] += data[news_date][category][news_company]["positive"]
                        result["negative"] += data[news_date][category][news_company]["negative"]
                        result["normal"] += data[news_date][category][news_company]["normal"]
            if infection_flag == 0:
                for news_company in data[news_date][category].keys():
                    if infection_flag == 0:
                        result["infections"] += data[news_date][category][news_company]["infections"]
                        infection_flag = 1
                        break
    return result

'''
코드 테스트용
pprint(date_total_keyword_specific_company_specific("경제", "조선일보"))
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
    for news_date in data.keys():
        if news_date == date:
            for category in data[news_date].keys():
                for news_company in data[news_date][category].keys():
                    if news_company == company:
                        result["total"] += data[news_date][category][news_company]["total"]
                        result["positive"] += data[news_date][category][news_company]["positive"]
                        result["negative"] += data[news_date][category][news_company]["negative"]
                        result["normal"] += data[news_date][category][news_company]["normal"]
                        result["infections"] = data[news_date][category][news_company]["infections"]
    return result

'''
코드 테스트용
pprint(date_specific_keyword_total_company_specific("2021.11.16", "조선일보"))
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
    for news_date in data.keys():
        if news_date == date:
            for category in data[news_date].keys():
                if category == keyword:
                    for news_company in data[news_date][category].keys():
                        result1["total"] += data[news_date][category][news_company]["total"]
                        result1["positive"] += data[news_date][category][news_company]["positive"]
                        result1["negative"] += data[news_date][category][news_company]["negative"]
                        result1["normal"] += data[news_date][category][news_company]["normal"]
                        result1["infections"] = data[news_date][category][news_company]["infections"]

                        if news_company not in result2["positive_ranking"]:
                            result2["positive_ranking"][news_company] = data[news_date][category][news_company]["positive"]
                        else:
                            result2["positive_ranking"][news_company] += data[news_date][category][news_company]["positive"]

                        if news_company not in result2["negative_ranking"]:
                            result2["negative_ranking"][news_company] = data[news_date][category][news_company]["negative"]
                        else:
                            result2["negative_ranking"][news_company] += data[news_date][category][news_company]["negative"]

                        if news_company not in result2["normal_ranking"]:
                            result2["normal_ranking"][news_company] = data[news_date][category][news_company]["normal"]
                        else:
                            result2["normal_ranking"][news_company] += data[news_date][category][news_company]["normal"]

    result3 = convert_count_to_ratio(result2)

    result = {
        "statistics": result1,
        "news_ranking": result3,
    }

    return result

'''
코드 테스트용
'''
pprint(date_specific_keyword_specific_company_total("2021.11.16", "경제"))

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
    for news_date in data.keys():
        if news_date == date:
            for category in data[news_date].keys():
                for news_company in data[news_date][category].keys():
                    result1["total"] += data[news_date][category][news_company]["total"]
                    result1["positive"] += data[news_date][category][news_company]["positive"]
                    result1["negative"] += data[news_date][category][news_company]["negative"]
                    result1["normal"] += data[news_date][category][news_company]["normal"]
                    result1["infections"] = data[news_date][category][news_company]["infections"]

                    if news_company not in result2["positive_ranking"]:
                        result2["positive_ranking"][news_company] = data[news_date][category][news_company]["positive"]
                    else:
                        result2["positive_ranking"][news_company] += data[news_date][category][news_company]["positive"]

                    if news_company not in result2["negative_ranking"]:
                        result2["negative_ranking"][news_company] = data[news_date][category][news_company]["negative"]
                    else:
                        result2["negative_ranking"][news_company] += data[news_date][category][news_company]["negative"]

                    if news_company not in result2["normal_ranking"]:
                        result2["normal_ranking"][news_company] = data[news_date][category][news_company]["normal"]
                    else:
                        result2["normal_ranking"][news_company] += data[news_date][category][news_company]["normal"]

    result3 = convert_count_to_ratio(result2)

    result = {
        "statistics": result1,
        "news_ranking": result3
    }

    return result

'''
코드 테스트용
pprint(date_specific_keyword_total_company_total("2021.11.16"))
'''

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
    for news_date in data.keys():
        infection_flag = 0
        for category in data[news_date].keys():
            if category == keyword:
                for news_company in data[news_date][category].keys():
                    result1["total"] += data[news_date][category][news_company]["total"]
                    result1["positive"] += data[news_date][category][news_company]["positive"]
                    result1["negative"] += data[news_date][category][news_company]["negative"]
                    result1["normal"] += data[news_date][category][news_company]["normal"]

                    if news_company not in result2["positive_ranking"]:
                        result2["positive_ranking"][news_company] = data[news_date][category][news_company]["positive"]
                    else:
                        result2["positive_ranking"][news_company] += data[news_date][category][news_company]["positive"]

                    if news_company not in result2["negative_ranking"]:
                        result2["negative_ranking"][news_company] = data[news_date][category][news_company]["negative"]
                    else:
                        result2["negative_ranking"][news_company] += data[news_date][category][news_company]["negative"]

                    if news_company not in result2["normal_ranking"]:
                        result2["normal_ranking"][news_company] = data[news_date][category][news_company]["normal"]
                    else:
                        result2["normal_ranking"][news_company] += data[news_date][category][news_company]["normal"]

            if infection_flag == 0:
                for news_company in data[news_date][category].keys():
                    result1["infections"] += data[news_date][category][news_company]["infections"]
                    infection_flag = 1
                    break

    result3 = convert_count_to_ratio(result2)

    result = {
        "statistics": result1,
        "news_ranking": result3
    }

    return result

'''
코드 테스트용
pprint(date_total_keyword_specific_company_total("경제"))
'''

# 6
def date_total_keyword_total_company_specific(company):
    result = {
        "total": 0,
        "positive": 0,
        "negative": 0,
        "normal": 0,
        "infections": 0
    }
    for news_date in data.keys():
        infection_flag = 0
        for category in data[news_date].keys():
            for news_company in data[news_date][category].keys():
                if news_company == company:
                    result["total"] += data[news_date][category][news_company]["total"]
                    result["positive"] += data[news_date][category][news_company]["positive"]
                    result["negative"] += data[news_date][category][news_company]["negative"]
                    result["normal"] += data[news_date][category][news_company]["normal"]
                if infection_flag == 0:
                    result["infections"] += data[news_date][category][news_company]["infections"]
                    infection_flag = 1

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
    for news_date in data.keys():
        if news_date == date:
            for category in data[news_date].keys():
                if category == keyword:
                    for news_company in data[news_date][category].keys():
                        if news_company == company:
                            result["total"] += data[news_date][category][news_company]["total"]
                            result["positive"] += data[news_date][category][news_company]["positive"]
                            result["negative"] += data[news_date][category][news_company]["negative"]
                            result["normal"] += data[news_date][category][news_company]["normal"]
                            result["infections"] = data[news_date][category][news_company]["infections"]
    return result

'''
코드 테스트용
pprint(date_specific_keyword_specific_company_specific("2021.11.16","경제","조선일보"))
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
    for news_date in data.keys():
        infection_flag = 0
        for category in data[news_date].keys():
            for news_company in data[news_date][category].keys():
                result1["total"] += data[news_date][category][news_company]["total"]
                result1["positive"] += data[news_date][category][news_company]["positive"]
                result1["negative"] += data[news_date][category][news_company]["negative"]
                result1["normal"] += data[news_date][category][news_company]["normal"]

                if news_company not in result2["positive_ranking"]:
                    result2["positive_ranking"][news_company] = data[news_date][category][news_company]["positive"]
                else:
                    result2["positive_ranking"][news_company] += data[news_date][category][news_company]["positive"]

                if news_company not in result2["negative_ranking"]:
                    result2["negative_ranking"][news_company] = data[news_date][category][news_company]["negative"]
                else:
                    result2["negative_ranking"][news_company] += data[news_date][category][news_company]["negative"]

                if news_company not in result2["normal_ranking"]:
                    result2["normal_ranking"][news_company] = data[news_date][category][news_company]["normal"]
                else:
                    result2["normal_ranking"][news_company] += data[news_date][category][news_company]["normal"]

            if infection_flag == 0:
                for news_company in data[news_date][category].keys():
                    result1["infections"] += data[news_date][category][news_company]["infections"]
                    infection_flag = 1
                    break

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
