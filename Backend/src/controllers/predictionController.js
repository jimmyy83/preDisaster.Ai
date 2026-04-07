const axios = require("axios");

const predictDisaster = async (req, res) => {
  try {
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

    const ML_API = process.env.ML_API_URL || "https://ml-api-zcln.onrender.com";

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

    // 🔥 DELAY (IMPORTANT)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 🔁 RETRY FUNCTION
    const callML = async (retry = 0) => {
      try {
        return await axios.post(`${ML_API}/predict`, payload, {
          timeout: 10000
        });
      } catch (err) {
        if (err.response?.status === 429 && retry < 2) {
          console.log("Retrying ML...");
          await new Promise(r => setTimeout(r, 2000));
          return callML(retry + 1);
        }
        throw err;
      }
    };

    const response = await callML();

    res.json({
      success: true,
      prediction: response.data
    });

  } catch (error) {
    console.log("ML ERROR:", error.response?.data || error.message);

    res.status(500).json({
      message: "Prediction error",
      error: error.response?.data || error.message
    });
  }
};

module.exports = {
  predictDisaster
};