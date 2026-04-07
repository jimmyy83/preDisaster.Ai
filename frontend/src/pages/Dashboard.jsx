import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import gsap from "gsap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Moon
} from "lucide-react";

const Dashboard = () => {
  const containerRef = useRef();
  const isFetching = useRef(false);

  const [prediction, setPrediction] = useState(() => {
    const saved = localStorage.getItem("prediction");
    return saved ? JSON.parse(saved) : null;
  });

  const [weather, setWeather] = useState(null);
  const [windHourly, setWindHourly] = useState([]);
  const [loading, setLoading] = useState(false);

  const isDanger = prediction && (prediction.probability?.normal < 0.5);

  // 🔥 NEW: get top disaster
const getTopDisaster = (prob) => {
  if (!prob) return null;

  const entries = Object.entries(prob).filter(
    ([key]) => key !== "normal"
  );

  if (!entries.length) return null;

  const top = entries.reduce((a, b) => (a[1] > b[1] ? a : b));

  return {
    name: top[0],
    value: Math.round(top[1] * 100),
    isWeak: top[1] < 0.15 // 🔥 NEW
  };
};

  const topDisaster = getTopDisaster(prediction?.probability);

  const getWeatherIcon = (code, isDay = true) => {
  // ☀️ Clear
  if (code === 0) {
    return isDay
      ? <Sun size={40} className="text-yellow-400" />
      : <Moon size={40} className="text-gray-300" />;
  }

  // ☁️ Cloudy
  if (code >= 1 && code <= 3) {
    return <Cloud size={40} className="text-gray-400" />;
  }

  // 🌫️ Fog
  if (code >= 45 && code <= 48) {
    return <Cloud size={40} className="text-gray-500" />;
  }

  // 🌧️ Rain
  if (code >= 51 && code <= 67) {
    return <CloudRain size={40} className="text-blue-400" />;
  }

  // ❄️ Snow
  if (code >= 71 && code <= 77) {
    return <CloudSnow size={40} className="text-blue-200" />;
  }

  // ⛈️ Thunderstorm
  if (code >= 80 && code <= 99) {
    return <CloudLightning size={40} className="text-yellow-300" />;
  }

  return <Cloud size={40} className="text-gray-500" />;
};

  const chartData = windHourly.map((wind, i) => ({
    hour: `${i + 1}h`,
    wind
  }));

  useEffect(() => {
    getLocationAndPredict();

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1 }
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getLocationAndPredict();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const getLocationAndPredict = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeather(28.6, 77.2)
    );
  };
  const getWeatherText = (code) => {
  if (code === 0) return "Clear Sky";
  if (code >= 1 && code <= 3) return "Cloudy";
  if (code >= 45 && code <= 48) return "Fog";
  if (code >= 51 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 99) return "Thunderstorm";
  
};

  const fetchWeather = async (lat, lon) => {
    if (isFetching.current) return;
    isFetching.current = true;

    try {
      setLoading(true);

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relativehumidity_2m,precipitation,windspeed_10m,surface_pressure&hourly=windspeed_10m`
      );

      const data = await res.json();

      if (!data.current) return;

      const current = data.current;
      const isDay = current.is_day === 1;
      setWeather(current);

      if (data.hourly?.windspeed_10m) {
        setWindHourly(data.hourly.windspeed_10m.slice(0, 6));
      }
      const mlData = {
  max_temp: current.temperature_2m + 2,
  min_temp: current.temperature_2m - 2,

  humidity_morning: current.relativehumidity_2m || 80,
  humidity_evening: current.relativehumidity_2m || 80,

  rain: current.precipitation || 0,

  wind_morning: current.windspeed_10m,
  wind_evening: current.windspeed_10m,

  pressure_morning: current.surface_pressure || 1010,
  pressure_evening: current.surface_pressure || 1008
};

      const mlRes = await api.post("/predict/", mlData);

      setPrediction(mlRes.data.prediction);

      localStorage.setItem(
        "prediction",
        JSON.stringify(mlRes.data.prediction)
      );

    } catch (err) {
      console.log("ML ERROR:", err.response?.data || err.message);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  const RiskMeter = ({ probabilities }) => {
    if (!probabilities) return null;

    const normalProb = probabilities.normal || 0;
    const risk = Math.round((1 - normalProb) * 100);
    const displayRisk = risk === 0 ? 5 : risk;

    const color =
      risk < 30 ? "#22c55e" :
      risk < 60 ? "#facc15" :
      "#ef4444";

    const label =
      risk < 30 ? "Low Risk" :
      risk < 60 ? "Moderate Risk" :
      "High Risk";

    const strokeDashoffset = 440 - (440 * displayRisk) / 100;

    return (
      <div className="flex flex-col items-center mt-4">
        <svg width="140" height="140">
          <circle cx="70" cy="70" r="60" stroke="#1e293b" strokeWidth="10" fill="none" />

          <motion.circle
            cx="70"
            cy="70"
            r="60"
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeDasharray="440"
            strokeDashoffset="440"
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5 }}
            transform="rotate(-90 70 70)"
          />
        </svg>

        <p className="text-xl font-bold mt-2" style={{ color }}>
          {displayRisk}%
        </p>

        <p className="text-sm text-gray-400">{label}</p>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen overflow-hidden pt-24 bg-gradient-to-br from-[#020617] via-[#0f172a] to-black text-white p-6"
    >
      <div className="max-w-7xl mx-auto">

        {isDanger && (
          <motion.div className="bg-red-600/20 border border-red-500 text-red-400 p-4 rounded-xl mb-6 text-center">
            High Risk Detected
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">

          {/* WEATHER */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
            <h3 className="text-gray-300 mb-4">Current Weather</h3>

            {weather ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      {getWeatherIcon(weather.weathercode, weather.is_day === 1)}
                    </div>

                    <p className="text-lg font-semibold text-gray-200">
                        {getWeatherText(weather.weathercode)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-4xl font-bold">
                      {weather.temperature_2m}°C
                    </p>
                    <p className="text-gray-400">
                      Rain: {weather.precipitation || 0} mm
                    </p>
                    <p className="text-gray-400">
                      Wind: {weather.windspeed_10m} km/h
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-5 overflow-x-auto pb-2">
                  {windHourly.map((wind, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
                      <p className="text-xs">{i + 1}h</p>
                      <p>{wind} km/h</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="animate-pulse h-20 bg-white/5 rounded-lg"></div>
            )}
          </div>

          {/* AI */}
          <div className={`p-4 rounded-2xl border ${
            isDanger ? "bg-red-500/10 border-red-500" : "bg-green-500/10 border-green-500"
          }`}>
            <h3 className="text-gray-300 mb-4">AI Prediction</h3>

            {loading ? (
              <p>Predicting...</p>
            ) : prediction ? (
              <>
                <p className={`text-3xl font-bold ${
                  isDanger ? "text-red-400" : "text-green-400"
                }`}>
                  {prediction?.prediction}
                </p>

                {/* 🔥 NEW: Disaster info */}
                {topDisaster && topDisaster.value > 0 && (
                    <p className="text-sm text-gray-300 mt-2">
                        ⚠️ Possible: <span className="text-yellow-400 font-semibold">
                            {topDisaster.name}
                          </span> ({topDisaster.value}%)

                            {topDisaster.isWeak && (
                          <span className="text-gray-400 ml-2">(low chance)</span>
                      )}
                </p>
              )}

                <RiskMeter probabilities={prediction?.probability} />
              </>
            ) : (
              <p>No data</p>
            )}
          </div>
        </div>

        {/* GRAPH */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="text-gray-300 mb-4">Wind Speed Trend</h3>

          <ResponsiveContainer width="100%" height={144}>
            <LineChart data={chartData}>
              <XAxis dataKey="hour" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip formatter={(value) => `${value} km/h`} />
              <Line type="monotone" dataKey="wind" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;