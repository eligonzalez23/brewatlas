"use client"

import Link from "next/link";

export default function Home() {
  return (
    <main
      className="hero"
      style={{
        display: "flex",
        flexDirection: "column", //stack items top-to-bottom
        justifyContent: "center", // center vertically
        alignItems: "center", // center horizontally
        height: "100vh",
        textAlign: "center",
      }}
    >
      <h1 style= {{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span role="img" aria-label="coffee">☕</span>
        BrewAtlas
      </h1>

      <p style={{ 
        marginTop: "1rem", 
        fontSize: "1.25rem", 
        color: "#e6ccb2", 
        fontStyle: "italic",
        }}>
        Find your next coffee spot fast.
      </p>

      <Link href="/map">
        <button
            style={{
            marginTop: "2rem",
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: "#fdfdfd",
            color: "#2c2c2c",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e5e5e5")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fdfdfd")}
        > 
          View Map
        </button>
      </Link>
    </main>
  );
}
