const axios = require("axios");

// 📏 Distance
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

// 🧠 Remove duplicates
const removeDuplicates = (arr) => {
    const seen = new Set();
    return arr.filter((item) => {
        const key = item.name + item.lat + item.lon;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};

// 📍 Smart Address Builder
const buildAddress = (tags) => {
    return (
        tags["addr:full"] ||
        [
            tags["addr:housenumber"],
            tags["addr:street"],
            tags["addr:city"],
            tags["addr:district"],
            tags["addr:state"]
        ]
        .filter(Boolean)
        .join(", ") ||
        tags.name ||
        "Location available on map"
    );
};

// 🔥 MAIN FUNCTION
const getNearestHelp = async (req, res) => {
    try {
        const { lat, lon } = req.body;

        if (!lat || !lon) {
            return res.json({
                message: "Location required",
                services: []
            });
        }

        const query = `
        [out:json][timeout:20];
        (
          node["amenity"="hospital"](around:5000,${lat},${lon});
          node["amenity"="police"](around:10000,${lat},${lon});
          node["amenity"="fire_station"](around:1000,${lat},${lon});
          node["amenity"="pharmacy"](around:5000,${lat},${lon});
        );
        out body;
        `;

        const url = "https://overpass-api.de/api/interpreter";

        const response = await axios.post(url, query, {
            headers: { "Content-Type": "text/plain" },
            timeout: 15000
        });

        if (!response.data || !response.data.elements) {
            return res.json({ services: [] });
        }

        let places = response.data.elements
            .filter(el => el.tags && el.tags.amenity)
            .map(el => {
                const distance = getDistance(lat, lon, el.lat, el.lon);

                return {
                    name: el.tags.name || "Unknown",
                    type: el.tags.amenity,
                    lat: el.lat,
                    lon: el.lon,
                    address: buildAddress(el.tags), // ✅ fixed
                    distance
                };
            });

        // 🔥 Remove duplicates
        places = removeDuplicates(places);

        // 🔥 Group
        const grouped = {
            hospital: [],
            police: [],
            fire_station: [],
            pharmacy: []
        };

        places.forEach(p => {
            if (grouped[p.type]) grouped[p.type].push(p);
        });

        // 🔥 Sort
        Object.keys(grouped).forEach(type => {
            grouped[type].sort((a, b) => a.distance - b.distance);
        });

        // 🔥 Balanced output
        const finalServices = [
              ...grouped.hospital,
              ...grouped.police,
              ...grouped.fire_station,
             ...grouped.pharmacy
        ];

        // 🔥 Format
        const formatted = finalServices.map(s => ({
            ...s,
            distance: s.distance.toFixed(2) + " km"
        }));

        res.json({
            message: "Emergency services",
            services: formatted
        });

    } catch (error) {
        console.error("ERROR:", error.message);

        res.json({
            message: "Fallback",
            services: []
        });
    }
};

module.exports = {
    getNearestHelp
};