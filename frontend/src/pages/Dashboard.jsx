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
import { Sun, Cloud, CloudRain, CloudSnow } from "lucide-react";

const Dashboard = () => {
  const containerRef = useRef();

  const [prediction, setPrediction] = useState(() => {
    const saved = localStorage.getItem("prediction");
    return saved ? JSON.parse(saved) : null;
  });

  const [weather, setWeather] = useState(null);
  const [windHourly, setWindHourly] = useState([]);
  const [loading, setLoading] = useState(false);

  const isDanger = prediction && (prediction.probability?.normal < 0.5);

  // 🔥 REAL WEATHER ICONS
  const getWeatherIcon = (code) => {
    if (code === 0) return <Sun size={40} className="text-yellow-400" />;
    if (code >= 1 && code <= 3) return <Cloud size={40} className="text-gray-400" />;
    if (code >= 51 && code <= 67) return <CloudRain size={40} className="text-blue-400" />;
    if (code >= 71) return <CloudSnow size={40} className="text-blue-200" />;
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

  // 🔥 Auto refresh
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

  const fetchWeather = async (lat, lon) => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=windspeed_10m`
      );

      const data = await res.json();

      if (!data.current_weather) return;

      const current = data.current_weather;
      setWeather(current);

      if (data.hourly?.windspeed_10m) {
        setWindHourly(data.hourly.windspeed_10m.slice(0, 6));
      }

      const mlData = {
        max_temp: current.temperature + 3,
        min_temp: current.temperature - 3,
        humidity_morning: 70,
        humidity_evening: 60,
        rain: 5,
        wind_morning: current.windspeed,
        wind_evening: current.windspeed,
        pressure_morning: 1010,
        pressure_evening: 1008
      };

      if (!prediction) {
        const mlRes = await api.post("/predict", mlData);
        setPrediction(mlRes.data.result);
        localStorage.setItem("prediction", JSON.stringify(mlRes.data.result));
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Risk Meter
  const RiskMeter = ({ probabilities }) => {
    if (!probabilities) return null;

    const normalProb = probabilities.normal || 0;
    const risk = Math.round((1 - normalProb) * 100);

    const color =
      risk < 30 ? "#22c55e" :
      risk < 60 ? "#facc15" :
      "#ef4444";

    const label =
      risk < 30 ? "Low Risk" :
      risk < 60 ? "Moderate Risk" :
      "High Risk";

    const strokeDashoffset = 440 - (440 * risk) / 100;

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
          {risk}%
        </p>

        <p className="text-sm text-gray-400">{label}</p>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen pt-24 bg-gradient-to-br from-[#020617] via-[#0f172a] to-black text-white p-6"
    >
      <div className="max-w-7xl mx-auto">

        {/* ALERT */}
        {isDanger && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-600/20 border border-red-500 text-red-400 p-4 rounded-xl mb-6 text-center"
          >
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
                      {getWeatherIcon(weather.weathercode)}
                    </div>

                    <div>
                      <p className="text-lg font-semibold text-gray-200">
                        Wind Conditions
                      </p>
                      <p className="text-sm text-gray-400">
                      
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-4xl font-bold">
                      {weather.temperature}°C
                    </p>
                    <p className="text-gray-400">
                      Wind: {weather.windspeed} km/h
                    </p>
                  </div>
                </div>

                {/* WIND HOURLY */}
                <div className="flex gap-3 mt-5 overflow-x-auto pb-2">
                  {windHourly.map((wind, i) => (
                    <div
                      key={i}
                      className="bg-white/5 border border-white/10 px-3 py-2 rounded-lg"
                    >
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
          <div className={`p-4 rounded-2xl border shadow-[0_0_25px_rgba(34,197,94,0.2)] ${
            isDanger
              ? "bg-red-500/10 border-red-500"
              : "bg-green-500/10 border-green-500"
          }`}>
            <h3 className="text-gray-300 mb-4">AI Prediction</h3>

            {loading ? (
              <p>Predicting...</p>
            ) : prediction ? (
              <>
                <p className={`text-3xl font-bold ${
                  isDanger ? "text-red-400" : "text-green-400"
                }`}>
                  {prediction.prediction}
                </p>

                <RiskMeter probabilities={prediction.probability} />
              </>
            ) : (
              <p>No data</p>
            )}
          </div>
        </div>

        {/* WIND GRAPH */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="text-gray-300 mb-4">Wind Speed Trend</h3>

          <ResponsiveContainer width="100%" height={174}>
            <LineChart data={chartData}>
              <XAxis dataKey="hour" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip formatter={(value) => `${value} km/h`} />

              <Line
                type="monotone"
                dataKey="wind"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;