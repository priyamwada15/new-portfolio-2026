"use client";

export default function FlipBoardTestPage() {
  return (
    <main style={{ paddingTop: 96 }}>
      <h1
        style={{
          fontFamily: "var(--font-hind), sans-serif",
          fontWeight: 600,
          margin: "0 0 16px 0",
          paddingLeft: 20,
        }}
      >
        Flip Board Test
      </h1>
      <p
        style={{
          fontFamily: "var(--font-hind), sans-serif",
          paddingLeft: 20,
        }}
      >
        Click the footer background to run the counter reveal.
      </p>
      <div style={{ height: 1200 }} aria-hidden />
    </main>
  );
}
