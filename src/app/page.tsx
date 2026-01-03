"use client";

import Link from "next/link";

import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["600"],
});


export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",

        // ✅ CHANGED: subtle warm gradient instead of flat bg
        background: "linear-gradient(180deg, var(--bg) 0%, #1A1714 60%, #141210 100%)",

        color: "var(--text)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "28px 18px",
      }}
    >
      {/* Header (like iOS) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "18px",
        }}
      >
        <button
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            border: `1px solid var(--border)`,

            // ✅ CHANGED: slightly more “card” feel
            background: "rgba(255,255,255,.04)",

            color: "var(--text)",
            fontSize: 18,
            cursor: "pointer",
            backdropFilter: "blur(10px)", // ✅ CHANGED
          }}
          aria-label="Menu"
        >
          ←
        </button>

        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            border: `1px solid var(--border)`,

            // ✅ CHANGED: warm surface
            background: "rgba(255,255,255,.04)",

            color: "var(--accent)",
            fontSize: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(10px)", // ✅ CHANGED
          }}
          title="Add"
        >
          +
        </div>
      </div>

      {/* Title */}
      <div style={{ textAlign: "left", maxWidth: 520, margin: "0 auto", width: "100%" }}>
        <h1
          className={playfair.className}
          style={{
            fontSize: "38px",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            margin: 0,
           }}
            >
          BrewAtlas
            </h1>


        <p
          style={{
            marginTop: 10,
            marginBottom: 18,
            color: "var(--muted)",
            fontSize: 16,
            lineHeight: 1.4,
          }}
        >
          Find your next coffee spot based on drinks, vibes, and real reviews.
        </p>

        {/* Card */}
        <div
          style={{
            // ✅ CHANGED: use surface2 for slightly brighter card like screenshot
            background: "var(--surface2)",

            border: `1px solid var(--border)`,
            borderRadius: 22,
            padding: 18,
            boxShadow: "0 18px 40px rgba(0,0,0,.35)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                background: "var(--accent2)",
                border: `1px solid var(--border)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent)",
                fontSize: 18,
              }}
            >
              📍
            </div>

            <div style={{ flex: 1 }}>
              <div
                className={playfair.className}
                style={{
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: "-0.01em",
               }}
                >
                Coffee Shops
                </div>

              <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 2 }}>
                Explore shops on the map with clean labels.
              </div>
            </div>
          </div>

          {/* ✅ CHANGED: subtle divider like iOS sections */}
          <div
            style={{
              height: 1,
              background: "var(--border)",
              margin: "12px 0 14px",
            }}
          />

          <Link href="/map" style={{ textDecoration: "none" }}>
            <button
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 18,
                border: `1px solid var(--border)`,

                // ✅ CHANGED: bronze-style button feel
                background: "rgba(192,139,86,.12)",
                color: "var(--accent)",

                fontWeight: 700,
                cursor: "pointer",
                transition: "background 0.2s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(192,139,86,.18)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(192,139,86,.12)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              View Map
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
