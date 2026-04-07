import { useState, useEffect, useRef } from "react";
import api from "../services/api";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef();
  const [typing, setTyping] = useState(false);

  
  useEffect(() => {
    setChat([
      { type: "bot", text: "👋 Hello! How can I help you today?" }
    ]);
  }, []);

  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

 
const sendMessage = async () => {
  if (!message.trim()) return;

  const userMsg = { type: "user", text: message };

  
  setChat((prev) => [...prev, userMsg]);

  setMessage("");

  try {
    setTyping(true); 

    const res = await api.post("/chatbot", { message });
    const reply = res.data.reply;

   
    setChat((prev) => [
      ...prev,
      { type: "bot", text: "" }
    ]);

 
    let i = 0;
    const interval = setInterval(() => {
      i++;

      setChat((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;

        updated[lastIndex] = {
          ...updated[lastIndex],
          text: reply.slice(0, i)
        };

        return updated;
      });

      if (i >= reply.length) {
        clearInterval(interval);
        setTyping(false);
      }
    }, 20);

  } catch (error) {
    console.log(error);
    setTyping(false);
  }
};

  return (
  <div className="relative h-screen flex flex-col bg-gray-900 text-white overflow-hidden">

   
    <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg p-4 flex items-center gap-3 m-4 rounded-2xl">
      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
        AI
      </div>
      <div>
        <h2 className="font-semibold text-white">Assistant</h2>
        <p
            className={`text-xs ${
            typing ? "text-yellow-400 animate-pulse" : "text-green-400"
        }`}
      >
  {typing ? "Typing..." : "Online"}
</p>
      </div>
    </div>
    <div className="flex gap-2 mb-4 flex-wrap">
  {["Fever", "Flood", "Earthquake", "Help"].map((item) => (
    <button
      key={item}
      onClick={() => setMessage(item)}
      className="px-3 py-1 text-sm bg-white/10 border border-white/10 rounded-full hover:bg-white/20 transition"
    >
      {item}
    </button>
  ))}
</div>

  
    <div className="relative z-10 flex-1 overflow-y-auto p-6 mx-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10">

      <div className="flex flex-col gap-4">

        {chat.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-5 py-3 rounded-2xl max-w-[75%] md:max-w-sm text-sm shadow-lg leading-relaxed ${
                msg.type === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white/10 text-white border border-white/10 rounded-bl-none"
              }`}
            >
              {msg.text}
              {typing && msg.type === "bot" && index === chat.length - 1 && (
                <span className="animate-pulse ml-1">|</span>
                )}
            </div>
          </div>
        ))}

        

        <div ref={chatEndRef}></div>
      </div>
    </div>

    {/* ✍ Input */}
    <div className="relative z-10 p-3 m-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center gap-3">

      <input
        type="text"
        className="flex-1 p-3 rounded-full bg-white/10 text-white placeholder-gray-400 outline-none"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />

      <button
        onClick={sendMessage}
        className="bg-blue-600 p-3 rounded-full text-white hover:scale-110 transition duration-200 shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-9.193-5.106A1 1 0 004 7v10a1 1 0 001.559.832l9.193-5.106a1 1 0 000-1.664z" />
        </svg>
      </button>

    </div>
  </div>
);
};

export default Chatbot;