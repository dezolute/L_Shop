export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  size: string;
  spice: number;
  image: string;
}

export interface BasketViewItem {
  product: Product;
  quantity: number;
}

export interface BasketView {
  userId: number;
  items: BasketViewItem[];
  total: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  login: string;
  phone: string;
  createdAt: string;
}

export interface Delivery {
  id: number;
  userId: number;
  items: { productId: number; quantity: number }[];
  address: string;
  phone: string;
  email: string;
  paymentMethod: "card" | "cash" | "online";
  total: number;
  createdAt: string;
}
