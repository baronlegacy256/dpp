export type Product = {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  attributes: Record<string, unknown> | null;
  created_at: string;
};

export type ProductEvent = {
  id: string;
  product_id: string;
  event_type: string;
  actor: string;
  location: string | null;
  notes: string | null;
  attributes: Record<string, unknown> | null;
  created_at: string;
};
