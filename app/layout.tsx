import "./globals.css";

export const metadata = {
  title: "SMS Reseller — Bulk SMS Gateway Platform",
  description: "High-quality SMS gateway reseller platform with Neon + Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
