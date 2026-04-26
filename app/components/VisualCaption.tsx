export default function VisualCaption({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[12px] font-medium tracking-wider text-muted mt-3 text-center">
      {children}
    </p>
  );
}
