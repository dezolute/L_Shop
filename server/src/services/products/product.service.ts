import { JsonStore } from '../../storage/json-store';
import { Product } from '../../types/models';

export interface ProductQuery {
  search?: string;
  sort?: 'price_asc' | 'price_desc';
  category?: string[];
  available?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export class ProductService {
  private readonly store = new JsonStore<Product[]>('products.json', []);

  async list(query: ProductQuery): Promise<Product[]> {
    const products = await this.store.read();
    let result = [...products];

    if (query.search) {
      const term = query.search.trim().toLowerCase();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term),
      );
    }

    if (query.category && query.category.length > 0) {
      const categories = query.category.map((cat) => cat.toLowerCase());
      result = result.filter((product) =>
        categories.includes(product.category.toLowerCase()),
      );
    }

    if (typeof query.available === 'boolean') {
      result = result.filter(
        (product) => product.available === query.available,
      );
    }

    if (typeof query.minPrice === 'number') {
      result = result.filter((product) => product.price >= query.minPrice!);
    }

    if (typeof query.maxPrice === 'number') {
      result = result.filter((product) => product.price <= query.maxPrice!);
    }

    if (query.sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    }
    if (query.sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }

  async getById(id: number): Promise<Product | null> {
    const products = await this.store.read();
    return products.find((product) => product.id === id) ?? null;
  }
}
