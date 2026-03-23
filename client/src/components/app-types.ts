export type Route = "/" | "/register" | "/basket" | "/delivery";

export type Filters = {
  search: string;
  sort: "price_asc" | "price_desc" | "";
  category: string;
  availableOnly: boolean;
  minPrice: string;
  maxPrice: string;
};

export const initialFilters: Filters = {
  search: "",
  sort: "",
  category: "",
  availableOnly: false,
  minPrice: "",
  maxPrice: "",
};
