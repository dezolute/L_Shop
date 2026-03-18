import { Request, Response } from 'express';
import { BasketService } from '../../services/basket/basket.service';
import { ProductService } from '../../services/products/product.service';

export class BasketController {
  constructor(
    private readonly basketService: BasketService,
    private readonly productService: ProductService,
  ) {}

  async get(req: Request, res: Response) {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const basket = await this.basketService.getBasket(req.userId);
    const products = await this.productService.list({});
    res.status(200).json(this.basketService.toView(basket, products));
  }

  async addItem(req: Request, res: Response) {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const { productId, quantity } = req.body as {
      productId?: number | string;
      quantity?: number | string;
    };
    const parsedProductId = Number(productId);
    const parsedQuantity = Number(quantity);
    if (
      Number.isNaN(parsedProductId) ||
      Number.isNaN(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      res.status(400).json({ message: 'Invalid payload' });
      return;
    }
    const product = await this.productService.getById(parsedProductId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    const basket = await this.basketService.addItem(
      req.userId,
      parsedProductId,
      parsedQuantity,
    );
    const products = await this.productService.list({});
    res.status(200).json(this.basketService.toView(basket, products));
  }

  async updateItem(req: Request, res: Response) {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const productId = Number(req.params.productId);
    const { quantity } = req.body as { quantity?: number | string };
    const parsedQuantity = Number(quantity);
    if (Number.isNaN(productId) || Number.isNaN(parsedQuantity)) {
      res.status(400).json({ message: 'Invalid payload' });
      return;
    }
    const basket = await this.basketService.setItem(
      req.userId,
      productId,
      parsedQuantity,
    );
    const products = await this.productService.list({});
    res.status(200).json(this.basketService.toView(basket, products));
  }

  async removeItem(req: Request, res: Response) {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const productId = Number(req.params.productId);
    if (Number.isNaN(productId)) {
      res.status(400).json({ message: 'Invalid product id' });
      return;
    }
    const basket = await this.basketService.removeItem(req.userId, productId);
    const products = await this.productService.list({});
    res.status(200).json(this.basketService.toView(basket, products));
  }
}
