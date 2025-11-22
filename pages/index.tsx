
// pages/index.tsx
"use client";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    res.ok ? setStatus("ok") : setStatus("error");
  };

  return (
    <main
      style={{
        background: "#000",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          background: "linear-gradient(90deg,#c084fc,#ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Lockgram
      </h1>
      <p style={{ marginTop: 16, fontSize: "1.25rem", color: "#ccc" }}>
        Own your chats, coins, future.
      </p>

      <form
        onSubmit={submit}
        style={{
          marginTop: 32,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: "100%",
          maxWidth: 320,
        }}
      >
        <input
          required
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "12px 16px", borderRadius: 8, color: "#000" }}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          style={{
            padding: "12px",
            borderRadius: 8,
            background: "linear-gradient(90deg,#9333ea,#ec4899)",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          {status === "sending" ? "Joining…" : "Join wait-list"}
        </button>
      </form>

      {status === "ok" && (
        <p style={{ marginTop: 16, color: "#4ade80" }}>Welcome aboard!</p>
      )}
      {status === "error" && (
        <p style={{ marginTop: 16, color: "#f87171" }}>Error. Try again?</p>
      )}

      <div style={{ marginTop: 40, display: "flex", gap: 20 }}>
        <a href="/litepaper.pdf" style={{ color: "#fff" }}>
          Litepaper
        </a>
        <a
          href="https://twitter.com/LockgramApp"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#fff" }}
        >
          Twitter
        </a>
        <a
          href="https://discord.gg/lockgram"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#fff" }}
        >
          Discord
        </a>
      </div>
    </main>
  );
}
