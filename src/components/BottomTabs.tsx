"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomTabs() {
  const pathname = usePathname();

  const mapActive = pathname.startsWith("/map");
  const profileActive = pathname.startsWith("/profile");

  return (
    <nav className="ba-bottom-tabs" aria-label="Main navigation">
      <Link
        href="/map"
        className={`ba-tab ${mapActive ? "ba-tab--active" : ""}`}
        aria-current={mapActive ? "page" : undefined}
      >
        <svg
          viewBox="0 0 24 24"
          className="ba-tab-icon"
          aria-hidden="true"
        >
          <path
            d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle
            cx="12"
            cy="10"
            r="2.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>

        <span>Map</span>
      </Link>

      <Link
        href="/profile"
        className={`ba-tab ${profileActive ? "ba-tab--active" : ""}`}
        aria-current={profileActive ? "page" : undefined}
      >
        <svg
          viewBox="0 0 24 24"
          className="ba-tab-icon"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="8"
            r="3.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M5.5 20c.7-4 3-6 6.5-6s5.8 2 6.5 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>

        <span>Profile</span>
      </Link>
    </nav>
  );
}