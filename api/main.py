import os

import firebase_admin
from firebase_admin import auth
from flask import Flask, jsonify, request
from google.cloud import storage


FIREBASE_PROJECT_ID = os.environ.get("FIREBASE_PROJECT_ID", "bot-friend-forever")
BUCKET_NAME = os.environ["BFF_BUCKET"]
WEB_ORIGIN = "https://mukesh1811.github.io"

firebase_admin.initialize_app(options={"projectId": FIREBASE_PROJECT_ID})
app = Flask(__name__)
bucket = storage.Client().bucket(BUCKET_NAME)


@app.route("/api/human", methods=["OPTIONS", "POST"])
def human():
    if request.headers.get("Origin") != WEB_ORIGIN:
        return jsonify(error="Origin not allowed"), 403

    cors = {
        "Access-Control-Allow-Origin": WEB_ORIGIN,
        "Vary": "Origin",
        "Cache-Control": "no-store",
    }
    if request.method == "OPTIONS":
        cors.update({
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Authorization",
        })
        return "", 204, cors

    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        return jsonify(error="Sign in required"), 401, cors
    try:
        user = auth.verify_id_token(header.removeprefix("Bearer "))
    except (ValueError, auth.InvalidIdTokenError, auth.ExpiredIdTokenError, auth.RevokedIdTokenError):
        return jsonify(error="Invalid sign-in"), 401, cors

    uid = user["uid"]
    name = user.get("name") or user.get("email", "").split("@")[0] or "friend"
    content = f"name: {json_string(name)}\nid: {json_string(uid)}\n"
    bucket.blob(f"users/{uid}/human.md").upload_from_string(
        content, content_type="text/markdown; charset=utf-8"
    )
    return jsonify(name=name, id=uid, content=content), 200, cors


def json_string(value):
    import json

    return json.dumps(value, ensure_ascii=False)
