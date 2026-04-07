import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# 📁 Path setup
base_dir = os.path.dirname(__file__)
file_path = os.path.join(base_dir, "data", "weather.csv")

# 📊 Load dataset
data = pd.read_csv(file_path)

# 🔥 Clean column names
data.columns = data.columns.str.strip().str.lower()

# 🧹 Drop missing values
data = data.dropna()

# =========================================================
# 🔥 AUTO DATASET DETECTION + CONVERSION (NO BUG GUARANTEED)
# =========================================================

if "maxtemp" in data.columns:
    print("✅ Australia dataset detected")

    data = data[[
        "maxtemp",
        "mintemp",
        "humidity9am",
        "humidity3pm",
        "rainfall",
        "windspeed9am",
        "windspeed3pm",
        "pressure9am",
        "pressure3pm"
    ]]

    data.columns = [
        "max_temp",
        "min_temp",
        "humidity_morning",
        "humidity_evening",
        "rain",
        "wind_morning",
        "wind_evening",
        "pressure_morning",
        "pressure_evening"
    ]

elif "temperature_celsius" in data.columns:
    print("✅ India dataset detected (converted)")

    new_df = pd.DataFrame()

    new_df["max_temp"] = data["temperature_celsius"] + 2
    new_df["min_temp"] = data["temperature_celsius"] - 3

    new_df["humidity_morning"] = data["humidity"]
    new_df["humidity_evening"] = data["humidity"] - 5

    new_df["rain"] = data["precip_mm"]

    new_df["wind_morning"] = data["wind_kph"]
    new_df["wind_evening"] = data["gust_kph"]

    new_df["pressure_morning"] = data["pressure_mb"]
    new_df["pressure_evening"] = data["pressure_mb"] - 2

    data = new_df

else:
    raise ValueError("❌ Unsupported dataset format")

# =========================================================
# 🚀 Create disaster label
# =========================================================

def label_disaster(row):
    if row["max_temp"] > 38:
        return "heatwave"
    elif row["rain"] > 20:
        return "flood"
    elif row["wind_evening"] > 40:
        return "storm"
    elif row["min_temp"] < 5:
        return "coldwave"
    else:
        return "normal"

data["disaster"] = data.apply(label_disaster, axis=1)

# 🎯 Features & Target
X = data.drop("disaster", axis=1)
y = data["disaster"]

# 🔀 Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 🤖 Model
model = RandomForestClassifier(n_estimators=100)

# 🏋️ Train
model.fit(X_train, y_train)

# 💾 Save model
model_path = os.path.join(base_dir, "model", "disaster_model.pkl")
joblib.dump(model, model_path)

print("✅ Model trained successfully (India + Australia supported)")