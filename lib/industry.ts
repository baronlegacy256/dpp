export type IndustryFieldType = "text" | "number" | "date";

export type IndustryId = "electronics" | "batteries" | "textiles";

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
  id: IndustryId;
  name: string;
  productFields: ProductField[];
  eventTypes: EventTypeConfig[];
};

const sharedEventTypes: EventTypeConfig[] = [
  { value: "manufactured", label: "Manufactured", color: "bg-emerald-500" },
  { value: "shipped", label: "Shipped", color: "bg-sky-500" },
  { value: "sold", label: "Sold", color: "bg-blue-500" },
  { value: "repaired", label: "Repaired", color: "bg-orange-500" },
  { value: "refurbished", label: "Refurbished", color: "bg-amber-500" },
  { value: "recycled", label: "Recycled", color: "bg-violet-500" },
];

export const industries: Record<IndustryId, IndustryConfig> = {
  electronics: {
    id: "electronics",
    name: "Electronics",
    productFields: [
      { key: "category", label: "Category", type: "text" },
      { key: "color", label: "Color", type: "text" },
      { key: "serialNumber", label: "Serial Number", type: "text" },
    ],
    eventTypes: sharedEventTypes,
  },
  batteries: {
    id: "batteries",
    name: "Batteries",
    productFields: [
      { key: "category", label: "Category", type: "text" },
      { key: "chemistry", label: "Chemistry", type: "text" },
      { key: "capacityKwh", label: "Capacity (kWh)", type: "number" },
      { key: "serialNumber", label: "Serial Number", type: "text" },
    ],
    eventTypes: sharedEventTypes,
  },
  textiles: {
    id: "textiles",
    name: "Textiles",
    productFields: [
      { key: "category", label: "Category", type: "text" },
      { key: "color", label: "Color", type: "text" },
      { key: "size", label: "Size", type: "text" },
      { key: "serialNumber", label: "Batch / Serial", type: "text" },
    ],
    eventTypes: sharedEventTypes,
  },
};

export const industryList = Object.values(industries);

export const allEventTypes = sharedEventTypes;

export const defaultIndustryId: IndustryId = "electronics";

// Backward-compatible default export for existing code paths during incremental UI upgrade.
export const industryConfig: IndustryConfig = industries[defaultIndustryId];

export function isIndustryId(value: unknown): value is IndustryId {
  return value === "electronics" || value === "batteries" || value === "textiles";
}

export function getIndustryConfig(value: unknown): IndustryConfig {
  return isIndustryId(value) ? industries[value] : industryConfig;
}

export function getProductIndustryId(attributes: Record<string, unknown> | null | undefined): IndustryId {
  const raw = attributes?.industry ?? attributes?.industryProfile;
  return isIndustryId(raw) ? raw : defaultIndustryId;
}

export function getEventTypeConfig(value: string, industry?: unknown): EventTypeConfig {
  const config = getIndustryConfig(industry);
  return (
    config.eventTypes.find((t) => t.value === value) ??
    allEventTypes.find((t) => t.value === value) ?? {
      value,
      label: value.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      color: "bg-slate-400",
    }
  );
}
