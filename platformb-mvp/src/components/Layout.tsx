export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <main className="main-content">{children}</main>
    </div>
  );
}
