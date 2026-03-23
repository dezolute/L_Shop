import { Request, Response } from 'express';
import { ProductService } from '../../services/products/product.service';

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  async list(req: Request, res: Response) {
    const query = {
      search: this.asString(req.query.search),
      sort: this.asString(req.query.sort) as
        | 'price_asc'
        | 'price_desc'
        | undefined,
      category: this.asArray(req.query.category),
      available: this.asBoolean(req.query.available),
      minPrice: this.asNumber(req.query.minPrice),
      maxPrice: this.asNumber(req.query.maxPrice),
    };
    const products = await this.productService.list(query);
    res.status(200).json(products);
  }

  async getOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: 'Invalid product id' });
      return;
    }
    const product = await this.productService.getById(id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json(product);
  }

  private asString(value: unknown): string | undefined {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
    return undefined;
  }

  private asArray(value: unknown): string[] | undefined {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string');
    }
    if (typeof value === 'string' && value.length > 0) {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return undefined;
  }

  private asBoolean(value: unknown): boolean | undefined {
    if (typeof value === 'string') {
      if (value === 'true') return true;
      if (value === 'false') return false;
    }
    return undefined;
  }

  private asNumber(value: unknown): number | undefined {
    if (typeof value === 'string' && value.length > 0) {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  }
}
