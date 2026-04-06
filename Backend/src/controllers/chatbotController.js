const axios = require("axios");

// 🔥 OFFLINE FALLBACK DATABASE
const fallbackData = {
  flood: `
🌊 Flood

Immediate Steps:
- Turant higher ground par shift ho jao
- Electric wires aur poles se door raho

Safety:
- Flood water me mat chalo (infection risk)
- Safe drinking water use karo

Emergency:
- Rescue team ya local authorities ko contact karo
`,

  earthquake: `
🌍 Earthquake

Immediate Steps:
- Drop, Cover, Hold
- Table ya strong object ke niche chhup jao

Safety:
- Windows aur glass se door raho
- Lift use mat karo

Emergency:
- Aftershock ke liye ready raho
`,

  heat: `
🔥 Heatwave / Heatstroke

Immediate Steps:
- Thandi jagah me jao
- Pani ya ORS piyo

Safety:
- Direct sunlight avoid karo
- Light clothes pehno

Emergency:
- Agar chakkar ya behoshi aaye → doctor
`,

  fire: `
🔥 Fire

Immediate Steps:
- Area turant chhodo
- Neeche jhuk kar move karo (smoke se bachne ke liye)

Safety:
- Lift use mat karo
- Fire exit use karo

Emergency:
- Fire brigade: 101
`,

  drought: `
🌵 Drought

Immediate Steps:
- Pani ka limited use karo
- Stored water safe rakho

Safety:
- Heat exposure kam karo
- Hydrated raho

Emergency:
- Govt water supply ya help center contact karo
`,

  storm: `
🌪 Storm / Cyclone

Immediate Steps:
- Ghar ke andar raho
- Windows band rakho

Safety:
- Electric devices unplug karo
- Trees aur poles se door raho

Emergency:
- Local alerts follow karo
`,

  cold: `
❄️ Cold Wave

Immediate Steps:
- Warm kapde pehno
- Garam drinks lo

Safety:
- Bahar kam niklo
- Body temperature maintain rakho

Emergency:
- Hypothermia symptoms par doctor
`,

  injury: `
🩸 Injury / Bleeding

Immediate Steps:
- Bleeding area par pressure lagao
- Clean bandage use karo

Safety:
- Infection se bachne ke liye clean rakho

Emergency:
- Bleeding na ruke → doctor
`,

  fever: `
🌡 Fever

Immediate Steps:
- Rest lo
- Pani zyada piyo

Safety:
- Body temperature monitor karo

Emergency:
- Fever >102°F ya 2 din se zyada
`,

  general: `
🚑 General Emergency

- Calm raho
- Situation assess karo
- Nearest help dhundo

Emergency:
- 112 (India helpline)
`
};

// 🚀 MAIN FUNCTION
const getChatbotReply = async (req, res) => {
  try {
    const { message } = req.body;
    const msg = message.toLowerCase();

    // 🔍 INTENT DETECTION
    let intent = "general";

    if (msg.includes("flood") || msg.includes("baarish")) intent = "flood";
    else if (msg.includes("earthquake") || msg.includes("bhukamp")) intent = "earthquake";
    else if (msg.includes("heat") || msg.includes("garmi")) intent = "heat";
    else if (msg.includes("fire") || msg.includes("aag")) intent = "fire";
    else if (msg.includes("storm") || msg.includes("cyclone")) intent = "storm";
    else if (msg.includes("cold") || msg.includes("thand")) intent = "cold";
    else if (msg.includes("drought") || msg.includes("paani ki kami")) intent = "drought";
    else if (msg.includes("injury") || msg.includes("chot")) intent = "injury";
    else if (msg.includes("fever") || msg.includes("bukhar")) intent = "fever";

    // 🚨 CRITICAL EMERGENCY
    if (
      msg.includes("help") ||
      msg.includes("urgent") ||
      msg.includes("bachao")
    ) {
      return res.json({
        source: "emergency-rule",
        reply: `
🚨 CRITICAL EMERGENCY!

📞 Call:
- Ambulance: 102
- Police: 100
- Fire: 101
`
      });
    }

    // 🤖 AI CALL
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/auto",
        temperature: 0.1,
        max_tokens: 250,
        messages: [
          {
            role: "system",
            content: `
            
            You are NOT a general chatbot.

You are a highly trained, real-world DISASTER MANAGEMENT & EMERGENCY HEALTH ASSISTANT.

Your role is to act like a LIFE-SAVING ASSISTANT who provides immediate, practical, real-world survival guidance during disasters and emergencies.

━━━━━━━━━━━━━━━━━━━
🔴 CORE RESPONSIBILITY
━━━━━━━━━━━━━━━━━━━
- Help users survive dangerous situations
- Provide accurate, actionable emergency steps
- Focus on REAL-WORLD safety (not theory)
- Act like a trained disaster response expert

━━━━━━━━━━━━━━━━━━━
🧠 CONTEXT AWARENESS
━━━━━━━━━━━━━━━━━━━
User Input: "${message}"
Detected Intent: "${intent}"

You MUST strictly follow the detected intent.

Examples:
- flood → drowning, water safety, infection risk
- heat → dehydration, heatstroke
- earthquake → collapse safety
- injury → bleeding control
- fire → smoke + escape
- general → basic emergency guidance

DO NOT mix topics.

━━━━━━━━━━━━━━━━━━━
⚠️ STRICT RULES (VERY IMPORTANT)
━━━━━━━━━━━━━━━━━━━
- DO NOT act like a normal chatbot
- DO NOT give emotional / motivational / philosophical advice
- DO NOT assume mental health issues
- DO NOT generate random or generic responses
- DO NOT hallucinate symptoms

ONLY give:
✔ practical
✔ situation-based
✔ survival-focused guidance

━━━━━━━━━━━━━━━━━━━
🧾 RESPONSE FORMAT (MANDATORY)
━━━━━━━━━━━━━━━━━━━

🚨 Situation:
- Clearly identify what is happening
- Mention the disaster or health issue

⚡ Immediate Steps:
- Step-by-step actions the user must take NOW
- Keep them short and actionable

🛡️ Safety Precautions:
- What to AVOID
- Risks involved

🚑 When to Seek Help:
- Clear conditions (when situation becomes serious)
- Mention emergency numbers if needed

━━━━━━━━━━━━━━━━━━━
🌍 REAL-WORLD INTELLIGENCE RULES
━━━━━━━━━━━━━━━━━━━
- Assume user may be in danger
- Prioritize survival over explanation
- Keep answers SHORT but POWERFUL
- Use simple Hinglish (Hindi + English mix)
- Avoid medical jargon
- Be clear, direct, and calm

━━━━━━━━━━━━━━━━━━━
🚫 OUTPUT RESTRICTIONS
━━━━━━━━━━━━━━━━━━━
- No long paragraphs
- No storytelling
- No irrelevant info
- No over-explanation

━━━━━━━━━━━━━━━━━━━
✅ EXAMPLE BEHAVIOR
━━━━━━━━━━━━━━━━━━━

If user says: "flood aa gaya"
→ Tell them to move to higher ground, avoid electric water, etc.

If user says: "bahut garmi lag rahi hai"
→ Give heatstroke prevention steps

If user says: "chot lag gayi"
→ Give bleeding control steps

━━━━━━━━━━━━━━━━━━━
🔚 END EVERY RESPONSE WITH:
⚠️ This is not a substitute for professional medical advice.`
          },
          {
            role: "user",
            content: message
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiReply =
      response.data.choices?.[0]?.message?.content || "";

    // 🛡️ FILTER
    if (!aiReply || aiReply.length < 30) {
      throw new Error("Bad AI");
    }

    res.json({
      source: "ai-smart",
      reply: aiReply
    });

  } catch (error) {
    console.log("AI ERROR:", error.message);

    const { message } = req.body;
    const msg = message.toLowerCase();

    let intent = "general";

    if (msg.includes("flood")) intent = "flood";
    else if (msg.includes("earthquake")) intent = "earthquake";
    else if (msg.includes("heat")) intent = "heat";
    else if (msg.includes("fire")) intent = "fire";
    else if (msg.includes("storm")) intent = "storm";
    else if (msg.includes("cold")) intent = "cold";
    else if (msg.includes("drought")) intent = "drought";
    else if (msg.includes("injury")) intent = "injury";
    else if (msg.includes("fever")) intent = "fever";

    res.json({
      source: "fallback-ultimate",
      reply: fallbackData[intent] || fallbackData["general"]
    });
  }
};

module.exports = { getChatbotReply };