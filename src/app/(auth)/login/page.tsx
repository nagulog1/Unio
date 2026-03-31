"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import UniOLogoMark from "@/components/shared/UniOLogoMark";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background:
          "radial-gradient(circle at 20% 20%, rgba(108,59,255,0.25), transparent 45%), radial-gradient(circle at 80% 80%, rgba(16,185,129,0.12), transparent 40%), #0A0A14",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 760,
          minHeight: 420,
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.45)",
          display: "flex",
          background: "#1E1E35",
          border: "1px solid #2D2D50",
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "22px 22px 18px",
            background: "linear-gradient(180deg, #16213E 0%, #1E1E35 100%)",
            color: "#F0F0FF",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRight: "1px solid #2D2D50",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              width: "fit-content",
              color: "#F0F0FF",
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                border: "1px solid #3D3D60",
                background: "#0F0F1A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UniOLogoMark className="w-4 h-4" />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8 }}>UNI-O</span>
          </Link>

          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 36,
                fontWeight: 700,
                lineHeight: 1,
                fontFamily: "'Space Grotesk', sans-serif",
                color: "#F0F0FF",
              }}
            >
              Welcome to...
            </h2>
            <p style={{ marginTop: 12, fontSize: 12, lineHeight: 1.5, maxWidth: 220, color: "#B8B8D9" }}>
              Login with your social account to continue in Uni-O. Compete, build and win with your community.
            </p>
          </div>

          <div style={{ fontSize: 10, color: "#8B8BAD" }}>Hackathons • Practice • Teams</div>
        </div>

        <div
          style={{
            flex: 1,
            padding: "26px 28px",
            color: "#F0F0FF",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "#1E1E35",
          }}
        >
          <h1 style={{ margin: 0, fontSize: 42, fontWeight: 700, color: "#F0F0FF", fontFamily: "'Space Grotesk', sans-serif" }}>Login</h1>
          <p style={{ marginTop: 8, marginBottom: 16, fontSize: 12, color: "#8B8BAD" }}>
            Welcome back! Log in using your account.
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              style={{
                width: "100%",
                height: 38,
                border: "1px solid #6C3BFF66",
                borderRadius: 3,
                padding: "0 10px",
                marginBottom: 10,
                background: "#16213E",
                color: "#F0F0FF",
                fontSize: 13,
              }}
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{
                width: "100%",
                height: 38,
                border: "1px solid #2D2D50",
                borderRadius: 3,
                padding: "0 10px",
                background: "#16213E",
                color: "#F0F0FF",
                fontSize: 13,
              }}
            />

            <label
              style={{
                marginTop: 10,
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                color: "#8B8BAD",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ width: 12, height: 12 }}
              />
              Remember me
            </label>

            <button
              type="submit"
              style={{
                marginTop: 14,
                width: "100%",
                height: 38,
                border: "none",
                borderRadius: 3,
                background: "#6C3BFF",
                color: "white",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              LOGIN WITH GOOGLE
            </button>
          </form>

          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/" })}
            style={{
              marginTop: 10,
              width: "100%",
              height: 38,
              border: "1px solid #2D2D50",
              borderRadius: 3,
              background: "#0F0F1A",
              color: "#F0F0FF",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path fill="currentColor" d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            LOGIN WITH GITHUB
          </button>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", fontSize: 11 }}>
            <Link href="/login" style={{ color: "#8B8BAD", textDecoration: "none" }}>
              Need help?
            </Link>
            <Link href="/" style={{ color: "#8B8BAD", textDecoration: "none" }}>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
