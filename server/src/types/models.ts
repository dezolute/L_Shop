export type Id = number;

export interface Product {
  id: Id;
  title: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  size: string;
  spice: number;
}