import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [hover3D, setHover3D] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white">

      {/* 🌍 3D Background */}
      <iframe
        src="https://my.spline.design/realisticearthwithdayandnightcycle-UTYDnppxjDqLRd9ak4Ic498I/"
        frameBorder="0"
        width="100%"
        height="100%"
        onMouseEnter={() => setHover3D(true)}
        onMouseLeave={() => setHover3D(false)}
        className={`absolute top-0 left-0 w-full h-full transition-transform duration-300
        ${hover3D ? "scale-105" : "scale-100"}`}
      />
        {/* 🔥 Hide Spline watermark */}
    <div className="absolute bottom-0 right-0 w-40 h-20 bg-black z-50 pointer-events-none"></div>
      {/* 🔥 Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* 💎 Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">

        {/* 🔥 Animated Title */}
        <h1 className="absolute top-20 text-5xl md:text-7xl font-extrabold tracking-wide 
        bg-linear-to-r from-blue-400 via-cyan-300 to-blue-600 
        bg-clip-text text-transparent animate-pulse">
          PreDisaster.AI
        </h1>

        {/* Subtitle */}
        <p className="max-w-xl text-gray-300 text-lg mt-32 mb-8">
          Predict disasters before they happen. Get alerts, guidance,
          and real-time help powered by AI.
        </p>

        {/* Buttons */}
        <div className="flex gap-6 flex-wrap justify-center">

          {/* 🚀 GET STARTED */}
          <button
            onClick={() => navigate("/auth")}
            className="bg-blue-600 px-8 py-3 rounded-xl 
            hover:scale-110 hover:bg-blue-500 
            transition-all duration-300 shadow-lg 
            hover:shadow-blue-500/50"
          >
            Get Started
          </button>

          
          

        </div>

      </div>

      {/* 💥 Shake Animation Style */}
      <style>
        {`
          .shake {
            animation: shake 0.3s infinite;
          }

          @keyframes shake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            25% { transform: translate(-1px, 2px) rotate(-1deg); }
            50% { transform: translate(2px, -1px) rotate(1deg); }
            75% { transform: translate(-2px, 1px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
          }
        `}
      </style>

    </div>
  );
};

export default Home;