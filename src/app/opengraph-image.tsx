import { ImageResponse } from "next/og";

export const alt = "CubeIT — AI Products, Custom Software and SaaS Engineering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          color: "white",
          background: "linear-gradient(130deg, #05112b 0%, #102f6b 60%, #1b58a5 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 38 }}>
          <div style={{ width: 66, height: 66, display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid #79caff", borderRadius: 18, color: "#9de4ff", fontSize: 35, fontWeight: 800 }}>C</div>
          <div style={{ fontSize: 35, fontWeight: 800, letterSpacing: 3 }}>CubeIT</div>
        </div>
        <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.12, maxWidth: 1040, letterSpacing: -2 }}>
          Intelligent software for modern businesses.
        </div>
        <div style={{ fontSize: 29, color: "#b8d7ff", marginTop: 28 }}>
          AI Products · Custom Software · SaaS Engineering
        </div>
        <div style={{ fontSize: 21, color: "#94b8ec", marginTop: 45 }}>www.cubeit.solutions</div>
      </div>
    ),
    size,
  );
}
