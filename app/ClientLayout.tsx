"use client";

import Providers from "./components/Providers";
import Navbar from "./components/Navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Navbar />
      <main className="min-h-screen">{children}</main>
    </Providers>
  );
}
