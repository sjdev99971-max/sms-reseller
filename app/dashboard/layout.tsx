import DashboardSidebar from "./sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dash">
      <DashboardSidebar />
      <main className="main">{children}</main>
    </div>
  );
}
