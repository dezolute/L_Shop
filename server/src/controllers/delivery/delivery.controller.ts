import { Request, Response } from 'express';
import { DeliveryService } from '../../services/delivery/delivery.service';
import { BasketService } from '../../services/basket/basket.service';
import { ProductService } from '../../services/products/product.service';

export class DeliveryController {
  constructor(
    private readonly deliveryService: DeliveryService,
    private readonly basketService: BasketService,
    private readonly productService: ProductService,
  ) {}

  async list(req: Request, res: Response) {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const deliveries = await this.deliveryService.listByUser(req.userId);
    res.status(200).json(deliveries);
  }

  async create(req: Request, res: Response) {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const { address, phone, email, paymentMethod } = req.body as {
      address?: string;
      phone?: string;
      email?: string;
      paymentMethod?: string;
    };
    if (
      !this.isNonEmpty(address) ||
      !this.isNonEmpty(phone) ||
      !this.isNonEmpty(email) ||
      !this.isPaymentMethod(paymentMethod)
    ) {
      res.status(400).json({ message: 'Invalid payload' });
      return;
    }
    const basket = await this.basketService.getBasket(req.userId);
    if (basket.items.length === 0) {
      res.status(400).json({ message: 'Basket is empty' });
      return;
    }
    const products = await this.productService.list({});
    const view = this.basketService.toView(basket, products);
    const delivery = await this.deliveryService.create(req.userId, {
      address,
      phone,
      email,
      paymentMethod,
      items: basket.items,
      total: view.total,
    });
    await this.basketService.clear(req.userId);
    res.status(201).json(delivery);
  }

  private isNonEmpty(value: string | undefined): value is string {
    return typeof value === 'string' && value.trim().length > 0;
  }

  private isPaymentMethod(
    value: string | undefined,
  ): value is 'card' | 'cash' | 'online' {
    return value === 'card' || value === 'cash' || value === 'online';
  }
}
