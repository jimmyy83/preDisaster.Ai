from flask import Flask, request, jsonify
import joblib
import os
import traceback
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ✅ Health check
@app.route("/")
def home():
    return {"message": "ML API Running"}

# 🔥 Lazy load model
model = None

def load_model():
    global model
    if model is None:
        base_dir = os.path.dirname(__file__)
        model_path = os.path.join(base_dir, "model", "disaster_model.pkl")
        print("📦 Loading model from:", model_path)
        model = joblib.load(model_path)
        print("✅ Model loaded")

# 🚀 Prediction API
@app.route("/predict", methods=["POST"])
def predict():
    try:
        load_model()  # 🔥 IMPORTANT

        data = request.json

        if not data:
            return jsonify({"error": "No input data"}), 400

        features = [[
            data.get("max_temp"),
            data.get("min_temp"),
            data.get("humidity_morning"),
            data.get("humidity_evening"),
            data.get("rain"),
            data.get("wind_morning"),
            data.get("wind_evening"),
            data.get("pressure_morning"),
            data.get("pressure_evening")
        ]]

        probs = model.predict_proba(features)[0]
        classes = model.classes_

        result = dict(zip(classes, probs))

        return jsonify({
            "prediction": max(result, key=result.get),
            "probability": result
        })

    except Exception as e:
        print("ERROR:", traceback.format_exc())
        return jsonify({
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run()