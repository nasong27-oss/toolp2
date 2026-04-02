import Navbar from "@/components/Navbar";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
