import BottomTabs from "@/components/BottomTabs";

export default function ProfilePage() {
  return (
    <main className="ba-profile-screen">
      <h1 className="ba-section-title">
        Profile
      </h1>

      <p
        style={{
          marginTop: 10,
          color: "var(--muted)",
          fontSize: 15,
        }}
      >
        Your BrewAtlas profile.
      </p>

      <BottomTabs />
    </main>
  );
}