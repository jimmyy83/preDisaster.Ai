import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import api from "../services/api";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef();

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(""); 
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const validate = () => {
    let newErrors = {};

    if (!form.email) {
      newErrors.email = "Please enter your email";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Please enter your password";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!form.name) {
        newErrors.name = "Please enter your name";
      }
      if (!form.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (!boxRef.current) return;

    gsap.fromTo(
      boxRef.current,
      { y: 80, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8 }
    );
  }, [isLogin]);

  // 🔥 auto hide success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 2500);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    setLoading(true);
    try {
      if (isLogin) {
        const res = await api.post("/login", {
          email: form.email,
          password: form.password
        });

        if (res.data.token) {
          localStorage.setItem("token", res.data.token);

          if (res.data.user) {
            localStorage.setItem("user", JSON.stringify(res.data.user));
          }

          navigate("/dashboard" ,{replace : true});
        }
      } else {
        const res = await api.post("/register", form);

        if (res.status === 201) {
          setSuccess("Registered successfully"); 
          setIsLogin(true);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message;

      if (msg?.toLowerCase().includes("email")) {
        setErrors({ email: msg });
      } else if (msg?.toLowerCase().includes("password")) {
        setErrors({ password: msg });
      } else {
        setErrors({ general: msg || "Login failed" });
      }
    } finally {
    setLoading(false);
  }
    
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white">

      <iframe
        src="https://my.spline.design/squarechipsfallinginplace-1JOQsDoSXnC4rmjlopZjFQ1U/"
        className="absolute top-0 left-0 w-full h-full blur-sm scale-110"
      ></iframe>

      <div className="absolute inset-0 bg-transparent"></div>

      <div
        ref={boxRef}
        className="absolute top-[55%] left-1/2 
        -translate-x-1/2 -translate-y-1/2 
        w-full max-w-lg p-16 min-h-96 rounded-3xl 
        backdrop-blur-xl"
      >

        <h2 className="text-3xl font-bold text-center mb-4 text-blue-300">
          {isLogin ? "Login" : "Create Account"}
        </h2>

        
        {success && (
          <p className="text-green-400 text-center mb-3">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                className={`p-3 rounded-lg bg-black/40 border ${
                  errors.name ? "border-red-500" : "border-white/20"
                }`}
              />
              {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className={`p-3 rounded-lg bg-black/40 border ${
              errors.email ? "border-red-500" : "border-white/20"
            }`}
          />
          {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className={`p-3 rounded-lg bg-black/40 border ${
              errors.password ? "border-red-500" : "border-white/20"
            }`}
          />
          {errors.password && (
            <p className="text-red-400 text-sm">{errors.password}</p>
          )}

          {!isLogin && (
            <>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                className={`p-3 rounded-lg bg-black/40 border ${
                  errors.confirmPassword ? "border-red-500" : "border-white/20"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm">
                  {errors.confirmPassword}
                </p>
              )}
            </>
          )}

          {errors.general && (
            <p className="text-red-500 text-center">{errors.general}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 py-3 rounded-lg flex items-center justify-center gap-2 transition ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {loading ? (
              <>
            
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
            </>
              ) : isLogin ? (
            "Login"
              ) : (
                "Register"
                )}
            </button>
        </form>

        <p className="text-sm text-gray-300 mt-5 text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 cursor-pointer ml-2"
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;