import pymongo
from flask import Blueprint, jsonify, request
import concatParts as cp
import concatNewses as cn

apis = Blueprint(__name__, 'apis')

def getParams():
    selected_date = request.args.get("date")
    selected_keyword = request.args.get("keyword")
    selected_company = request.args.get("company")

    if selected_date == "total":
        is_date_total = True
    if selected_keyword == "total":
        is_keyword_total = True
    if selected_company == "total":
        is_company_total = True
    return {
        is_total: (is_date_total, is_keyword_total, is_company_total),
        params: (selected_date, selected_keyword, selected_company)
    }


@apis.route('/api/statistics', methods=["GET"])
def statistics():
    reqested = getParams()

    if requested[is_total][0]:
        if requested[is_total][1]:
            if requested[is_total][2]:
                return jsonify(cp.)




@apis.route('/api/newses', methods=["GET"])
def news_list():
