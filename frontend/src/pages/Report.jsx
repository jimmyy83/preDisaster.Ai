import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import api from "../services/api";

// 🔥 Marker icon
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32]
});

// 🔥 Map Component
const LocationPicker = ({ setForm, form, onClose }) => {
  const [position, setPosition] = useState(null);

  const MapClick = () => {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);

        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();

        setForm({ ...form, location: data.display_name });
      }
    });
    return null;
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer center={[26.4499, 80.3319]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClick />
        {position && <Marker position={position} icon={customIcon} />}
      </MapContainer>

      <div className="absolute top-4 left-4 bg-black/70 px-4 py-2 rounded-xl text-white">
        Click on map to select location
      </div>

      {position && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-green-500/20 px-4 py-2 rounded-xl text-green-300">
          Location Selected
        </motion.div>
      )}

      {position && (
        <motion.button whileHover={{ scale: 1.05 }} onClick={onClose} className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl text-white">
          Confirm Location
        </motion.button>
      )}
    </div>
  );
};

const Report = () => {
  const [form, setForm] = useState({ type: "", location: "", description: "", severity: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showMap, setShowMap] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};
    if (!form.type) errors.type = "Select disaster type";
    if (!form.location) errors.location = "Location required";
    if (!form.description) errors.description = "Description required";
    if (!form.severity) errors.severity = "Select severity";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    try {
      setLoading(true);
      await api.post("/reports", form);
      setSuccess("Report submitted successfully");
      setForm({ type: "", location: "", description: "", severity: "" });
    } catch {
      setError("Error submitting report");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      setForm({ ...form, location: data.display_name });
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 text-white">

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl p-8 backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl">

        <h1 className="text-3xl text-center mb-6">Disaster Report</h1>

        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 mb-3">
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* TYPE */}
          <div>
            <label className="text-sm text-gray-300">Disaster Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className={`w-full mt-1 p-3 rounded-xl bg-[#020617] border ${fieldErrors.type ? "border-red-500" : "border-white/10"}`}
            >
              <option value="">Select Type</option>
                ~<option>Flood</option>
                <option>Earthquake</option>
                <option>Cyclone</option>
                <option>Hurricane</option>
                <option>Tornado</option>
                <option>Tsunami</option>
                <option>Landslide</option>
                <option>Avalanche</option>
                <option>Drought</option>
                <option>Heatwave</option>
                <option>Cold Wave</option>
                <option>Wildfire</option>
                <option>Volcanic Eruption</option>
                <option>Storm</option>
                <option>Lightning Strike</option>

                {/* 🏭 Man-Made Disasters */}
                <option>Fire Accident</option>
                <option>Industrial Accident</option>
                <option>Chemical Leak</option>
                <option>Gas Leak</option>
                <option>Oil Spill</option>
                <option>Building Collapse</option>
                <option>Bridge Collapse</option>
                <option>Mine Collapse</option>
                <option>Explosion</option>
                <option>Nuclear Radiation</option>

                {/* 🚗 Accidents */}
                <option>Road Accident</option>
                <option>Train Accident</option>
                <option>Airplane Crash</option>
                <option>Ship Accident</option>

                {/* 🦠 Health Emergencies */}
                <option>Pandemic</option>
                <option>Epidemic</option>
                <option>Food Poisoning</option>

                {/* ⚠️ Others */}
                <option>Stampede</option>
                <option>Terror Attack</option>
                <option>Power Failure</option>
                <option>Water Shortage</option>
                <option>Other Emergency</option>
            </select>
            {fieldErrors.type && <p className="text-red-400 text-xs">{fieldErrors.type}</p>}
          </div>

          {/* LOCATION */}
          <div>
            <label className="text-sm text-gray-300">Location</label>
            <div className="flex gap-3 mt-2">
              <button type="button" onClick={getCurrentLocation} className="flex-1 p-3 bg-blue-500/10 rounded-xl">Current</button>
              <button type="button" onClick={() => setShowMap(true)} className="flex-1 p-3 bg-purple-500/10 rounded-xl">Map</button>
            </div>
            <input
              value={form.location}
              readOnly
              className={`w-full mt-2 p-3 rounded-xl bg-[#020617] border ${fieldErrors.location ? "border-red-500" : "border-white/10"}`}
            />
            {fieldErrors.location && <p className="text-red-400 text-xs">{fieldErrors.location}</p>}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm text-gray-300">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`w-full mt-1 p-3 rounded-xl bg-[#020617] border ${fieldErrors.description ? "border-red-500" : "border-white/10"}`}
              placeholder="Describe what happened..."
              spellCheck={false}
            />
            {fieldErrors.description && <p className="text-red-400 text-xs">{fieldErrors.description}</p>}
          </div>

          {/* SEVERITY */}
          <div>
            <label className="text-sm text-gray-300">Severity</label>
            <select
              value={form.severity}
              onChange={(e) => setForm({ ...form, severity: e.target.value })}
              className={`w-full mt-1 p-3 rounded-xl bg-[#020617] border ${fieldErrors.severity ? "border-red-500" : "border-white/10"}`}
            >
              <option value="">Select Severity</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            {fieldErrors.severity && <p className="text-red-400 text-xs">{fieldErrors.severity}</p>}
          </div>

          <motion.button
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            className={`w-full p-3 rounded-xl ${loading ? "bg-gray-600" : "bg-gradient-to-r from-indigo-600 to-blue-600"}`}
          >
            {loading ? "Submitting..." : "Submit Report"}
          </motion.button>

        </form>
      </motion.div>

      {/* MAP */}
      <AnimatePresence>
        {showMap && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="relative w-[90%] h-[75vh] rounded-2xl overflow-hidden">
              <button onClick={() => setShowMap(false)} className="absolute top-4 right-4 z-[1000] bg-red-500/20 px-3 py-1 rounded text-red-300">Close</button>
              <LocationPicker setForm={setForm} form={form} onClose={() => setShowMap(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Report;
