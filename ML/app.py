from flask import Flask, request, jsonify
import joblib
import os
import traceback
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ✅ Health check route (VERY IMPORTANT for Render)
@app.route("/")
def home():
    return {"message": "ML API Running"}

# 📁 Load model safely
base_dir = os.path.dirname(__file__)
model_path = os.path.join(base_dir, "model", "disaster_model.pkl")

try:
    model = joblib.load(model_path)
    print("✅ Model loaded successfully")
except Exception as e:
    print("❌ Model load error:", e)

# 🚀 Prediction API
@app.route("/predict", methods=["POST"])
def predict():
    try:
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

# 🔥 Local run only
if __name__ == "__main__":
    app.run()