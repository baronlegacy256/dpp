import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register product",
  description: "Register a new product and generate its Digital Product Passport QR code.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
