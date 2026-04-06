import { useEffect, useState, useRef } from "react";
import api from "../services/api";

const Emergency = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const hasFetched = useRef(false);

  // 📍 USER ADDRESS
  const getAddress = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      setAddress(data.display_name);
    } catch (err) {
      console.log(err);
    }
  };

  // 🎯 ICON SELECTOR
  const getIcon = (type) => {
    switch (type) {
      case "hospital":
        return (
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21V3M3 12h18" />
          </svg>
        );
      case "police":
        return (
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l9 4v6c0 5-3.8 9.7-9 11-5.2-1.3-9-6-9-11V6l9-4z" />
          </svg>
        );
      case "fire_station":
        return (
          <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2s4 4 4 8a4 4 0 11-8 0c0-4 4-8 4-8z" />
          </svg>
        );
      case "pharmacy":
        return (
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21V3M3 12h18" />
          </svg>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setLocation({ lat, lon });
        getAddress(lat, lon);

        try {
          const res = await api.post("/emergency", { lat, lon });

          // ✅ DIRECT USE (NO EXTRA API CALLS)
          setServices(res.data.services);

        } catch (err) {
          console.log(err);
        }

        setLoading(false);
      },
      () => setLoading(false)
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6 pt-24">

      {/* 🔥 TITLE */}
      <h1 className="text-4xl font-bold text-center mb-8 tracking-wide">
        Emergency Services
      </h1>

      {/* 📍 LOCATION */}
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-5 rounded-2xl text-center mb-8 shadow-lg">
        {location ? (
          <p className="text-green-400 text-sm">{address || "Fetching..."}</p>
        ) : (
          <p className="text-gray-400">Fetching location...</p>
        )}
      </div>

      {/* 🏥 SERVICES */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-3xl shadow-2xl">

        <h2 className="text-xl font-semibold mb-6 text-center text-gray-300">
          Nearby Help
        </h2>

        {loading ? (
          <p className="text-center text-gray-400 animate-pulse">
            Fetching nearby services...
          </p>
        ) : services.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-5">
            {services.map((s, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-white/20 transition"
              >
                {/* ICON + NAME */}
                <div className="flex items-center gap-3 mb-3">
                  {getIcon(s.type)}
                  <h3 className="text-lg font-semibold">{s.name}</h3>
                </div>

                {/* TYPE */}
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                  {s.type.replace("_", " ")}
                </p>

                {/* ADDRESS */}
                <p className="text-sm text-gray-400 line-clamp-2">
                  {s.address || "Location available on map"}
                </p>

                {/* DISTANCE */}
                {s.distance && (
                  <p className="text-xs text-green-400 mt-2 font-medium">
                    {s.distance} away
                  </p>
                )}

                {/* MAP BUTTON */}
                <a
                  href={`https://www.google.com/maps?q=${s.lat},${s.lon}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-sm px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 transition"
                >
                  Open in Maps →
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            No nearby services found
          </p>
        )}
      </div>
    </div>
  );
};

export default Emergency;