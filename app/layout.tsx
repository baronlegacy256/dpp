import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Product Passport",
  description: "Digital Product Passport demonstrator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
