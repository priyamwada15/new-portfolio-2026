import DevAgentation from "../components/DevAgentation";

export default function SalesforceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <DevAgentation />
    </>
  );
}
