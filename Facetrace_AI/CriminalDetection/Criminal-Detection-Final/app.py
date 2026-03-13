from flask import Flask, request, Response, jsonify, session
from flask_cors import CORS
import sqlite3
import face_recognition
import numpy as np
import cv2
import pickle
import time
import os
print("USING DB FILE:", os.path.abspath("record.db"))

app = Flask(__name__)
app.secret_key = "your_secret_key"
CORS(app, supports_credentials=True)

VALID_USERNAME = "kalpesh"
VALID_PASSWORD = "kalpesh123"


def get_db_connection():
    return sqlite3.connect(
        "record.db",
        check_same_thread=False,
        timeout=30
    )



@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.json
    if data["username"] == VALID_USERNAME and data["password"] == VALID_PASSWORD:
        session["logged_in"] = True
        return jsonify({"success": True})
    return jsonify({"success": False}), 401


@app.route("/api/logout", methods=["POST"])
def api_logout():
    session.pop("logged_in", None)
    return jsonify({"success": True})


@app.route("/api/check-auth")
def check_auth():
    return jsonify({"authenticated": session.get("logged_in", False)})


@app.route("/api/add-record", methods=["POST"])
def api_add_record():
    data = request.form
    images = request.files.getlist("images")

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO known_faces (name, age, city, category, details) VALUES (?, ?, ?, ?, ?)",
        (data["name"], data["age"], data["city"], data["category"], data["details"])
    )

    person_id = cursor.lastrowid

    for img in images:
        image = face_recognition.load_image_file(img)
        encodings = face_recognition.face_encodings(image)
        for enc in encodings:
            cursor.execute(
                "INSERT INTO face_encodings (person_id, encoding) VALUES (?, ?)",
                (person_id, pickle.dumps(enc))
            )

    conn.commit()
    conn.close()
    return jsonify({"success": True})


@app.route("/api/records")
def api_view_records():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT name, age, city, category, details FROM known_faces")
    records = [
        dict(zip(["name", "age", "city", "category", "details"], row))
        for row in cursor.fetchall()
    ]

    conn.close()
    return jsonify(records)


@app.route("/api/detection-logs")
def api_detection_logs():
    print("USING DB FILE:", r"D:\Training Tasks\CriminalDetection\Criminal-Detection-Final\record.db")

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, person_name, category, last_location, time
        FROM detection_events
        ORDER BY time DESC
    """)

    logs = [
        dict(zip(["id", "name", "category", "location", "time"], row))
        for row in cursor.fetchall()
    ]

    conn.close()
    return jsonify(logs)


client_frames = {}


@app.route("/video_feed/<client_id>")
def video_feed(client_id):
    return Response(generate_frame(client_id),
                    mimetype="multipart/x-mixed-replace; boundary=frame")


def generate_frame(client_id):
    while True:
        if client_id in client_frames:
            ret, jpeg = cv2.imencode(".jpg", client_frames[client_id])
            if ret:
                yield (
                    b"--frame\r\n"
                    b"Content-Type: image/jpeg\r\n\r\n" +
                    jpeg.tobytes() +
                    b"\r\n\r\n"
                )
        time.sleep(0.05)


def get_face_encodings():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT person_id, encoding FROM face_encodings")
    encodings = [(r[0], pickle.loads(r[1])) for r in cursor.fetchall()]

    cursor.execute("SELECT id, name, category FROM known_faces")
    faces = {r[0]: {"name": r[1], "category": r[2]} for r in cursor.fetchall()}

    conn.close()
    return encodings, faces


LAST_DETECTED = {}


def log_detection(name, category, location, frame):
    conn = get_db_connection()
    cursor = conn.cursor()

    _, jpeg = cv2.imencode(".jpg", frame)
    frame_bytes = jpeg.tobytes()

    cursor.execute("""
        INSERT INTO detection_events
        (person_name, category, last_location, detected_frame)
        VALUES (?, ?, ?, ?)
    """, (name, category, location, frame_bytes))

    conn.commit()
    conn.close()


def process_frame(frame, location):
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    face_encs = face_recognition.face_encodings(rgb)

    known_encs, face_map = get_face_encodings()
    detected = []

    for fe in face_encs:
        for pid, ke in known_encs:
            distance = face_recognition.face_distance([ke], fe)[0]
            if distance < 0.45:
                person = face_map[pid]

                detected.append({
                    "name": person["name"],
                    "category": person["category"],
                    "confidence": round((1 - distance) * 100, 2)
                })

                key = f"{person['name']}_{location}"
                now = time.time()

                if key not in LAST_DETECTED or now - LAST_DETECTED[key] >= 10:
                    log_detection(person["name"], person["category"], location, frame)
                    LAST_DETECTED[key] = now

    return detected


@app.route("/upload_frame/<client_id>", methods=["POST"])
def upload_frame(client_id):
    location = client_id.strip()

    data = request.files["frame"].read()
    frame = cv2.imdecode(np.frombuffer(data, np.uint8), cv2.IMREAD_COLOR)

    client_frames[location] = frame
    detected = process_frame(frame, location)

    return jsonify({"detected": detected})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, threaded=True)
