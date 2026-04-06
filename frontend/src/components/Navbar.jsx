import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { User } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  // 🔥 SAFE user parsing
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const linkClass = (path) =>
    `relative hover:text-blue-400 transition ${
      location.pathname === path ? "text-blue-400" : "text-white"
    }`;

  // close dropdown
  useEffect(() => {
    const handleClick = () => setOpen(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <nav className="fixed top-3 left-3 right-3 z-50 
      bg-black/30 backdrop-blur-xl border-b border-white/10 
      text-white px-8 py-4 flex justify-between items-center shadow-lg
      hover:shadow-blue-500/10 transition rounded-lg">

      <h1 className="text-2xl font-extrabold text-blue-500">
        preDisaster.AI
      </h1>

      <div className="flex gap-6 items-center text-sm md:text-base">

        <Link className={linkClass("/dashboard")} to="/dashboard">
          Dashboard
        </Link>

        <Link className={linkClass("/chatbot")} to="/chatbot">
          Chatbot
        </Link>

        <Link className={linkClass("/emergency")} to="/emergency">
          Emergency
        </Link>

        <Link className={linkClass("/report")} to="/report">
          Report
        </Link>

        {!token ? (
          <button
            onClick={() => navigate("/auth")}
            className="ml-4 px-5 py-2 rounded-xl 
            bg-linear-to-r from-blue-500 to-cyan-400 
            hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 
            transition-all duration-300 font-semibold"
          >
            Get Started
          </button>
        ) : (
          <div className="relative ml-4">

            {/* PROFILE ICON */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
              className="cursor-pointer p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10"
            >
              <User size={22} />
            </div>

            {/* DROPDOWN */}
            {open && (
              <div className="absolute right-0 mt-3 w-56 bg-[#0f172a] border border-white/10 rounded-xl shadow-xl p-4 z-50">

                <div>
                  <p className="text-sm font-semibold">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user?.email || "No email"}
                  </p>
                </div>

                <div className="border-t border-white/10 my-3"></div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left text-sm text-red-400 hover:bg-red-500/10 px-2 py-2 rounded-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;