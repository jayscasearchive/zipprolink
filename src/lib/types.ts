export type ZipCode = {
  zip_code: string;
  city: string;
  county_name: string | null;
  state_id: string;
  state_name: string;
  latitude: number | null;
  longitude: number | null;
  population: number | null;
  density: number | null;
  created_at: string;
};

export type ServiceCategory = {
  id: number;
  slug: string;
  name: string;
  avg_price_min: number;
  avg_price_max: number;
  avg_response_time: string;
  is_active: boolean;
  created_at: string;
  phone_en?: string | null;
  phone_es?: string | null;
};

export type NeighborZip = Pick<
  ZipCode,
  "zip_code" | "city" | "state_id" | "state_name"
>;

export type FaqItem = {
  question: string;
  answer: string;
};

export type DirectoryPageData = {
  zip: ZipCode;
  service: ServiceCategory;
  neighbors: NeighborZip[];
};
