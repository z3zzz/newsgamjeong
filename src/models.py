from flask import jsonify, request, render_template
from database import suggest_list, project_link_list, extra_list
import uuid
from datetime import datetime, timedelta, timezone
from bcrypt import hashpw, gensalt, checkpw

def current_time():
    koreanTime = timezone(timedelta(hours=+9))
    current_time = datetime.now(koreanTime)
    return current_time.strftime("%Y-%m-%d %H:%M")


class SuggestList:
    def post_list(self):
        data = request.get_json()
        password_hashed = hashpw(bytes(data["password"],"UTF-8"), gensalt())
        suggest = {
            "_id": uuid.uuid4().hex,
            "title": data["title"],
            "content": data["content"],
            "createdAt": current_time(),
            "isCompleted": False,
            "password": password_hashed
        }

        if suggest_list.insert_one(suggest):
            return jsonify({"result": "제안이 잘 등록되었습니다! 좋은 제안 감사합니다 :)"}), 200
        else:
            return jsonify({"result": "제안 등록에 실패하였습니다.."}), 400

    def get_list(self):
        suggests = suggest_list.find({}).sort("createdAt", -1)
        return render_template("suggest.html", suggests=suggests)


    def edit_list(self):
        data = request.get_json()
        if "toggleSuggest" not in data:
            b_password = bytes(data["password"], "UTF-8")
            suggest = suggest_list.find_one({"_id": data["suggest_id"]})
            if not suggest:
                return jsonify({"result": "Could not find the suggest with the suggest_id"}), 400
            if checkpw(b_password, suggest["password"]):
                if suggest_list.update_one({"_id": data["suggest_id"]}, {"$set": {"title": data["title"], "content": data["content"], "createdAt": current_time()}}):
                    return jsonify({"result": "수정이 완료되었습니다 :)"}), 200
                else:
                    return jsonify({"result": "수정이 안되었습니다.." }), 400
            else:
                return jsonify({"result": "비밀번호가 맞지 않습니다 :("}), 200
        else:
            password = data["password"]
            isCompleted = data["isCompleted"]
            suggest = suggest_list.find_one({"_id": data["suggest_id"]})
            if not suggest:
                return jsonify({"result": "Could not find the suggest with the suggest_id"}), 400
            if password == "fronter99":
                if isCompleted == "False":
                    toggle_to = True
                else:
                    toggle_to = False
                if suggest_list.update_one({"_id": data["suggest_id"]}, {"$set": {"isCompleted": toggle_to}}):
                    return jsonify({"result": "수정이 완료되었습니다 :)"}), 200
                else:
                    return jsonify({"result": "수정이 안되었습니다.." }), 400
            else:
                return jsonify({"result": "비밀번호가 맞지 않습니다 :("}), 200




            return jsonify({"result": "success"})

    def delete_list(self):
        data = request.get_json()
        b_password = bytes(data["password"], "UTF-8")
        suggest = suggest_list.find_one({"_id": data["suggest_id"]})
        if not suggest:
            return jsonify({"result": "Could not find the suggest with the suggest_id"}), 400
        if checkpw(b_password, suggest["password"]):
            if suggest_list.delete_one(suggest):
                return jsonify({"result": "삭제가 완료되었습니다 :)"}), 200
            else:
                return jsonify({"result": "삭제가 안되었습니다.." }), 400
        else:
            return jsonify({"result": "비밀번호가 맞지 않습니다 :("}), 200




