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

export interface User {
  id: Id;
  name: string;
  email: string;
  login: string;
  phone: string;
  password: string;
  createdAt: string;
}