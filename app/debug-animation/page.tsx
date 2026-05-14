import { DebugChatPreview } from "../components/DebugChatPreview";

export default function DebugAnimationPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        backgroundColor: "#F8F8F8",
      }}
    >
      <DebugChatPreview />
    </div>
  );
}
