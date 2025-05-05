export default function ProductPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
