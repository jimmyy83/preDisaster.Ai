import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";

function App() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const pageRef = useRef();

  const hideNavbarRoutes = ["/", "/auth", "/chatbot", "/emergency", "/report"];

  const shouldShowNavbar =
    token && !hideNavbarRoutes.includes(location.pathname);

  useEffect(() => {
    if (!pageRef.current) return;

    const tl = gsap.timeline();

    // 🔥 EXIT (previous page fade out)
    tl.to(pageRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: "power1.out"
    });

    // 🔥 ENTER (new page fade in + smooth)
    tl.fromTo(
      pageRef.current,
      { opacity: 0, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
    );

  }, [location.pathname]);

  return (
    <div>
      {shouldShowNavbar && <Navbar />}

      <div ref={pageRef}>
        <AppRoutes />
      </div>
    </div>
  );
}

export default App;