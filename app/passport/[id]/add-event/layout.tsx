import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add event",
  description: "Record a new lifecycle event for a Digital Product Passport.",
};

export default function AddEventLayout({ children }: { children: React.ReactNode }) {
  return children;
}
