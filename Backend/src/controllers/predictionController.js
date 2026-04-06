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

    // 🔥 Validation (IMPORTANT)
    if (
      max_temp === undefined ||
      min_temp === undefined ||
      humidity_morning === undefined
    ) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    // 🔥 ML API URL (env se lo)
    const ML_API = process.env.ML_API_URL || "http://localhost:5000";

    // 🔥 Call ML API
    const response = await axios.post(
      `${ML_API}/predict`,
      {
        max_temp,
        min_temp,
        humidity_morning,
        humidity_evening,
        rain,
        wind_morning,
        wind_evening,
        pressure_morning,
        pressure_evening
      },
      {
        timeout: 5000 // ⏱️ important
      }
    );

    res.json({
      success: true,
      prediction: response.data
    });

  } catch (error) {
    console.log("ML ERROR:", error.message);

    res.status(500).json({
      message: "Prediction error",
      error: error.response?.data || error.message
    });
  }
};

module.exports = {
  predictDisaster
};