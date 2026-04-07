const axios = require("axios");

let cachedPrediction = null;
let lastFetchTime = null;

const predictDisaster = async (req, res) => {
  try {
    const now = Date.now();

    // ✅ 10 min cache (stronger)
    if (
      cachedPrediction &&
      lastFetchTime &&
      now - lastFetchTime < 600000
    ) {
      console.log("⚡ Using cached prediction");
      return res.json({
        success: true,
        prediction: cachedPrediction
      });
    }

    const {
      max_temp,
      min_temp,
      humidity_morning,
      humidity_evening,
      rain,
      wind_morning,
      wind_evening,
      pressure_morning,
      pressure_evening
    } = req.body;

    const ML_API =
      process.env.ML_API_URL || "https://ml-api-zcln.onrender.com";

    const payload = {
      max_temp: Number(max_temp),
      min_temp: Number(min_temp),
      humidity_morning: Number(humidity_morning),
      humidity_evening: Number(humidity_evening),
      rain: Number(rain),
      wind_morning: Number(wind_morning),
      wind_evening: Number(wind_evening),
      pressure_morning: Number(pressure_morning),
      pressure_evening: Number(pressure_evening)
    };

    // ✅ SINGLE CALL ONLY (NO retry, NO delay)
    const response = await axios.post(`${ML_API}/predict`, payload, {
      timeout: 60000
    });

    // ✅ cache save
    cachedPrediction = response.data;
    lastFetchTime = now;

    return res.json({
      success: true,
      prediction: response.data
    });

  } catch (error) {
    console.log(" ML ERROR:", error.response?.data || error.message);

    // ✅ fallback
    if (cachedPrediction) {
      console.log("⚡ Sending cached fallback");
      return res.json({
        success: true,
        prediction: cachedPrediction
      });
    }

    return res.status(500).json({
      message: "Prediction error",
      error: error.response?.data || error.message
    });
  }
};

module.exports = {
  predictDisaster
};