export type IndustryFieldType = "text" | "number" | "date";

export type ProductField = {
  key: string;
  label: string;
  type: IndustryFieldType;
};

export type EventTypeConfig = {
  value: string;
  label: string;
  color: string; // Tailwind-compatible dot/background class token for timeline UI
};

export type IndustryConfig = {
  name: string;
  productFields: ProductField[];
  eventTypes: EventTypeConfig[];
};

export const industryConfig: IndustryConfig = {
  name: "Electronics",
  productFields: [
    { key: "category", label: "Category", type: "text" },
    { key: "color", label: "Color", type: "text" },
    { key: "serialNumber", label: "Serial Number", type: "text" },
  ],
  eventTypes: [
    { value: "manufactured", label: "Manufactured", color: "bg-emerald-500" },
    { value: "shipped", label: "Shipped", color: "bg-sky-500" },
    { value: "inspected", label: "Inspected", color: "bg-amber-500" },
    { value: "repaired", label: "Repaired", color: "bg-orange-500" },
    { value: "recycled", label: "Recycled", color: "bg-violet-500" },
  ],
};

export function getEventTypeConfig(value: string): EventTypeConfig {
  return (
    industryConfig.eventTypes.find((t) => t.value === value) ?? {
      value,
      label: value.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      color: "bg-slate-400",
    }
  );
}
