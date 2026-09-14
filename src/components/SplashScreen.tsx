"use client";

import { useEffect, useRef, useState } from "react";

type SplashScreenProps = {
  ready: boolean;
};

export default function SplashScreen({ ready }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (!ready) return;

    // Prevent the splash from flashing away too quickly
    // if the map happens to load instantly.
    const minimumVisibleTime = 2500;
    const elapsed = Date.now() - startedAt.current;
    const remaining = Math.max(0, minimumVisibleTime - elapsed);

    const fadeTimer = window.setTimeout(() => {
      setLeaving(true);
    }, remaining);

    const removeTimer = window.setTimeout(() => {
      setVisible(false);
    }, remaining + 420);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, [ready]);

  if (!visible) return null;

  return (
    <div
      className={`ba-splash ${leaving ? "ba-splash--leaving" : ""}`}
      aria-hidden={leaving}
    >
      <div className="ba-splash-content">
        <div className="ba-splash-emblem">
          <span className="ba-splash-ring ba-splash-ring-one" />
          <span className="ba-splash-ring ba-splash-ring-two" />

          <img
            src="/brewatlas-mark.svg"
            alt=""
            className="ba-splash-mark"
          />
        </div>

        <div className="ba-splash-wordmark">
          BrewAtlas
        </div>

        <div className="ba-splash-tagline">
          COFFEE&nbsp;&nbsp; EXPLORE&nbsp;&nbsp; BELONG
        </div>

        <div className="ba-splash-loading">
          <span className="ba-splash-loading-line" />
          <span>Loading the map...</span>
        </div>
      </div>
    </div>
  );
}