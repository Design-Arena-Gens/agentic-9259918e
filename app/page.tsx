"use client";
import { useEffect, useRef, useState } from "react";

type Source = { title: string; url: string };

type Message = {
  role: "user" | "agent";
  content: string;
  sources?: Source[];
};

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("mensch-agent-chat");
    if (stored) setMessages(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("mensch-agent-chat", JSON.stringify(messages));
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function onAsk() {
    if (!input.trim()) return;
    const q = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: q }]);
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q })
      });
      if (!res.ok) throw new Error("Fehler beim Abrufen der Antwort");
      const data = await res.json();
      setMessages((m) => [...m, { role: "agent", content: data.answer, sources: data.sources }]);
    } catch (e: any) {
      setMessages((m) => [...m, { role: "agent", content: "Entschuldigung, es ist ein Fehler aufgetreten." }]);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onAsk();
    }
  }

  return (
    <div className="container">
      <div className="header">
        <span className="title">Agent ?ber den Menschen</span>
        <span className="sub">Frage zu Biologie, Psyche, Kultur und Geschichte</span>
      </div>
      <div className="card">
        <div className="messages" ref={listRef}>
          {messages.length === 0 && (
            <div className="small">Stelle eine Frage wie: "Wie funktioniert das Immunsystem?"</div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role === "user" ? "msg-user" : "msg-bot"}`}>
              <div>{m.content}</div>
              {m.sources && m.sources.length > 0 && (
                <div className="sources">
                  Quellen: {m.sources.map((s, idx) => (
                    <span key={s.url} className="source">
                      {idx > 0 ? ", " : null}
                      <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="input-row">
          <input
            className="input"
            placeholder="Deine Frage ?ber den Menschen?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
          />
          <button className="button" disabled={loading} onClick={onAsk}>{loading ? "Antwortet?" : "Fragen"}</button>
        </div>
        <div className="footer-hint small">Der Agent gibt sachliche Antworten und zeigt Quellen (Wikipedia/Wikidata).</div>
      </div>
    </div>
  );
}
