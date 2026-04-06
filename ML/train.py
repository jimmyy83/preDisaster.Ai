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

# 🔥 IMPORTANT: remove extra spaces from column names
data.columns = data.columns.str.strip()

# 🧹 Drop missing values
data = data.dropna()

# 🎯 Select best features
data = data[[
    "MaxTemp",
    "MinTemp",
    "Humidity9am",
    "Humidity3pm",
    "Rainfall",
    "WindSpeed9am",
    "WindSpeed3pm",
    "Pressure9am",
    "Pressure3pm"
]]

# 🔄 Rename columns (ML friendly)
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

# 🚀 Create disaster label (IMPORTANT LOGIC)
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

print("✅ Model trained with REAL dataset + MULTI disaster!")