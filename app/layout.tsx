import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TracePass",
    template: "%s | TracePass",
  },
  description:
    "TracePass is a Digital Product Passport demonstrator showing a product's origin, journey, sustainability, and compliance data in one scan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
