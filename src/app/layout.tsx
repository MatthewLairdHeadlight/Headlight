import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Headlight - Healthcare Communication Portal",
  description: "Secure portal for healthcare providers and patients to communicate, share forms, and process payments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 font-sans">
        {children}
      </body>
    </html>
  );
}
