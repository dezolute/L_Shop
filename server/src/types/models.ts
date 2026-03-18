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

export interface Session {
  id: string;
  userId: Id;
  expiresAt: string;
}

export interface BasketItem {
  productId: Id;
  quantity: number;
}

export interface Basket {
  userId: Id;
  items: BasketItem[];
}

export interface BasketViewItem {
  product: Product;
  quantity: number;
}

export interface BasketView {
  userId: Id;
  items: BasketViewItem[];
  total: number;
}