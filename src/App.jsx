import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are "Apex Protocol" — a warm, direct, and genuinely helpful dating coach for men of all ages. You specialize in building authentic confidence, social skills, and emotional intelligence for dating and relationships.

Your personality: Encouraging but real. You don't sugarcoat, but you're never harsh. You celebrate wins, normalize struggle, and always focus on the man becoming his best self — not manipulation or tricks. You believe respect for women is non-negotiable and central to genuine attraction.

You give practical, actionable advice on:
- Building real confidence (not fake it til you make it)
- Approaching women naturally in real-life and online settings
- Conversation skills, texting, and keeping things engaging
- First dates: planning, topics, energy
- Reading signals and knowing when to escalate or pull back
- Handling rejection without it crushing confidence
- Online dating profiles, photos, and openers
- Style, grooming, body language, and presence
- Navigating modern dating for men in their 30s, 40s, 50s+
- Moving from casual hookups to serious relationships, or vice versa
- Dealing with anxiety, loneliness, and the emotional side of dating

Always be:
- Concrete: give specific examples, scripts, or frameworks when relevant
- Non-judgmental: no shame about inexperience, past failures, or age
- Respectful: treat women as full humans, not targets
- Motivating: remind men that change is possible at any age

Keep responses conversational and to the point — not too long. Use occasional line breaks for readability. If someone seems stuck, ask a clarifying question to get them the most useful advice.`;

const QUICK_TOPICS = [
  { emoji: "💪", label: "Building Confidence", prompt: "How do I build genuine confidence when approaching women? I struggle a lot with self-doubt." },
  { emoji: "📱", label: "Online Dating", prompt: "Give me tips on optimizing my dating app profile and writing openers that actually get replies." },
  { emoji: "🗣️", label: "Conversation Skills", prompt: "I run out of things to say quickly. How do I have great conversations that build real connection?" },
  { emoji: "📅", label: "First Dates", prompt: "What makes a great first date? Planning, topics, energy — walk me through it." },
  { emoji: "😬", label: "Handling Rejection", prompt: "Rejection really gets to me. How do I handle it without it destroying my confidence?" },
  { emoji: "⏰", label: "Dating in My 30s+", prompt: "I'm in my mid-to-late 30s and feel behind. How do I approach dating at this stage of life?" },
  { emoji: "💬", label: "Texting & Follow-ups", prompt: "How do I text after getting a number? I always seem to either over-text or go cold." },
  { emoji: "🔥", label: "Body Language & Presence", prompt: "How do I improve my body language and overall presence to be more attractive?" },
];

const TypingDots = () => (
  <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "4px 0" }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: 8, height: 8, borderRadius: "50%", background: "#c9a96e",
        animation: "bounce 1.2s ease-in-out infinite",
        animationDelay: `${i * 0.2}s`
      }} />
    ))}
  </div>
);

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    setStarted(true);

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages,
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Something went wrong. Try again.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Connection issue. Please try again." }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0d0b08",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #1a1610; }
        ::-webkit-scrollbar-thumb { background: #3d3020; border-radius: 2px; }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        .msg-bubble { animation: fadeUp 0.3s ease forwards; }
        .topic-btn:hover { background: #2a2010 !important; border-color: #c9a96e !important; transform: translateY(-2px); }
        .topic-btn { transition: all 0.2s ease; }
        .send-btn:hover:not(:disabled) { background: #e8c07e !important; }
        .send-btn { transition: background 0.2s; }
        textarea:focus { outline: none; border-color: #c9a96e !important; }
        textarea { resize: none; }
      `}</style>

      {/* Header */}
      <div style={{
        width: "100%", maxWidth: 720, padding: "32px 24px 0",
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "linear-gradient(135deg, #c9a96e, #8b6914)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, flexShrink: 0,
          boxShadow: "0 0 20px rgba(201,169,110,0.3)"
        }}>🦅</div>
        <div>
          <div style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 26, fontWeight: 900, color: "#f0e6d0",
            letterSpacing: "-0.5px", lineHeight: 1,
          }}>Apex Protocol</div>
          <div style={{ fontSize: 13, color: "#8a7860", fontFamily: "'Source Sans 3', sans-serif", marginTop: 3 }}>
            Your personal dating confidence coach
          </div>
        </div>
        <div style={{
          marginLeft: "auto", fontSize: 11, color: "#5a4e3c",
          fontFamily: "'Source Sans 3', sans-serif", textAlign: "right",
          letterSpacing: "0.05em", textTransform: "uppercase",
        }}>
          <div style={{ color: "#7a9a6a", marginBottom: 2 }}>● Online</div>
          Always available
        </div>
      </div>

      {/* Divider */}
      <div style={{
        width: "100%", maxWidth: 720, padding: "0 24px",
        marginTop: 20, marginBottom: 0,
      }}>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #3d3020, transparent)" }} />
      </div>

      {/* Main Chat Area */}
      <div style={{
        width: "100%", maxWidth: 720, flex: 1,
        padding: "24px 24px 0", display: "flex", flexDirection: "column",
        minHeight: 0,
      }}>

        {/* Welcome / Quick Topics */}
        {!started && (
          <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
            <div style={{
              background: "linear-gradient(135deg, #1a1610 60%, #221c10)",
              border: "1px solid #3d3020", borderRadius: 16,
              padding: "28px 28px 24px", marginBottom: 28,
            }}>
              <div style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 22, color: "#f0e6d0", fontWeight: 700,
                marginBottom: 12, lineHeight: 1.3,
              }}>
                Hey — you're already ahead of most men.
              </div>
              <div style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 15, color: "#a09070", lineHeight: 1.7,
              }}>
                Just showing up and wanting to improve takes guts. Whether you're navigating the 
                apps, asking someone out in real life, or just trying to stop overthinking — 
                I'm here. No judgment, just real talk.
              </div>
              <div style={{
                marginTop: 16, fontSize: 13, color: "#6a5c44",
                fontFamily: "'Source Sans 3', sans-serif", fontStyle: "italic",
              }}>
                Ask me anything, or pick a topic to get started →
              </div>
            </div>

            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: 10, marginBottom: 24,
            }}>
              {QUICK_TOPICS.map((t) => (
                <button key={t.label} className="topic-btn" onClick={() => sendMessage(t.prompt)}
                  style={{
                    background: "#130f0a", border: "1px solid #2d2318",
                    borderRadius: 12, padding: "14px 16px",
                    cursor: "pointer", textAlign: "left", color: "#c8b896",
                    fontFamily: "'Source Sans 3', sans-serif",
                  }}>
                  <span style={{ fontSize: 18, display: "block", marginBottom: 6 }}>{t.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#d4c4a0" }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.map((m, i) => (
            <div key={i} className="msg-bubble" style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            }}>
              {m.role === "assistant" && (
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "linear-gradient(135deg, #c9a96e, #8b6914)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, flexShrink: 0, marginRight: 10, marginTop: 2,
                }}>🦅</div>
              )}
              <div style={{
                maxWidth: "78%",
                background: m.role === "user"
                  ? "linear-gradient(135deg, #8b6914, #c9a96e)"
                  : "#1a1610",
                border: m.role === "user" ? "none" : "1px solid #2d2318",
                borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
                padding: "14px 18px",
                color: m.role === "user" ? "#0d0b08" : "#c8b896",
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 15, lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="msg-bubble" style={{ display: "flex", alignItems: "flex-start" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg, #c9a96e, #8b6914)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, flexShrink: 0, marginRight: 10,
              }}>🦅</div>
              <div style={{
                background: "#1a1610", border: "1px solid #2d2318",
                borderRadius: "4px 18px 18px 18px", padding: "14px 18px",
              }}>
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={bottomRef} style={{ height: 1 }} />
        </div>
      </div>

      {/* Input Area */}
      <div style={{
        width: "100%", maxWidth: 720,
        padding: "20px 24px 28px", position: "sticky", bottom: 0,
        background: "linear-gradient(to top, #0d0b08 80%, transparent)",
      }}>
        <div style={{
          display: "flex", gap: 10, alignItems: "flex-end",
          background: "#130f0a", border: "1px solid #2d2318",
          borderRadius: 16, padding: "10px 10px 10px 18px",
        }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask anything — no question is too basic or embarrassing..."
            rows={1}
            style={{
              flex: 1, background: "transparent", border: "1px solid transparent",
              color: "#d4c4a0", fontSize: 15, lineHeight: 1.6,
              fontFamily: "'Source Sans 3', sans-serif",
              maxHeight: 120, overflowY: "auto",
            }}
            onInput={e => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
          />
          <button className="send-btn" onClick={() => sendMessage()} disabled={!input.trim() || loading}
            style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: input.trim() && !loading ? "#c9a96e" : "#2d2318",
              border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, transition: "background 0.2s",
            }}>
            ↑
          </button>
        </div>
        <div style={{
          textAlign: "center", marginTop: 10, fontSize: 11,
          color: "#4a3e2e", fontFamily: "'Source Sans 3', sans-serif",
          letterSpacing: "0.03em",
        }}>
          Advice is for informational purposes · Always approach women with genuine respect
        </div>
      </div>
    </div>
  );
}