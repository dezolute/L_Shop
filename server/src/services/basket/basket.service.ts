import { JsonStore } from '../../storage/json-store';
import {
  Basket,
  BasketView,
  BasketViewItem,
  Id,
  Product,
} from '../../types/models';

export class BasketService {
  private readonly store: JsonStore<Basket[]> = new JsonStore<Basket[]>('baskets.json', []);

  async getBasket(userId: Id): Promise<Basket> {
    const baskets: Basket[] = await this.store.read();
    const existing: Basket | undefined = baskets.find((basket) => basket.userId === userId);
    if (existing) {
      return existing;
    }
    const basket: Basket = { userId, items: [] };
    baskets.push(basket);
    await this.store.write(baskets);
    return basket;
  }

  async setItem(userId: Id, productId: Id, quantity: number): Promise<Basket> {
    const baskets: Basket[] = await this.store.read();
    const basket: Basket | undefined = baskets.find((item) => item.userId === userId);
    if (!basket) {
      const created: Basket = { userId, items: [{ productId, quantity }] };
      baskets.push(created);
      await this.store.write(baskets);
      return created;
    }
    const existing = basket.items.find((item) => item.productId === productId);
    if (existing) {
      existing.quantity = quantity;
    } else {
      basket.items.push({ productId, quantity });
    }
    basket.items = basket.items.filter((item) => item.quantity > 0);
    await this.store.write(baskets);
    return basket;
  }

  async addItem(userId: Id, productId: Id, quantity: number): Promise<Basket> {
    const basket: Basket = await this.getBasket(userId);
    const existing = basket.items.find((item) => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      basket.items.push({ productId, quantity });
    }
    const baskets: Basket[] = await this.store.read();
    const updated: Basket[] = baskets.map((item) =>
      item.userId === userId ? basket : item,
    );
    await this.store.write(updated);
    return basket;
  }

  async removeItem(userId: Id, productId: Id): Promise<Basket> {
    const basket: Basket = await this.getBasket(userId);
    basket.items = basket.items.filter((item) => item.productId !== productId);
    const baskets: Basket[] = await this.store.read();
    const updated: Basket[] = baskets.map((item) =>
      item.userId === userId ? basket : item,
    );
    await this.store.write(updated);
    return basket;
  }

  async clear(userId: Id): Promise<void> {
    const baskets: Basket[] = await this.store.read();
    const updated: Basket[] = baskets.map((item) =>
      item.userId === userId ? { ...item, items: [] } : item,
    );
    await this.store.write(updated);
  }

  toView(basket: Basket, products: Product[]): BasketView {
    const items: BasketViewItem[] = basket.items
      .map((item): BasketViewItem | null => {
        const product: Product | undefined = products.find((p) => p.id === item.productId);
        if (!product) {
          return null;
        }
        return { product, quantity: item.quantity };
      })
      .filter((item): item is BasketViewItem => item !== null);

    const total: number = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    return { userId: basket.userId, items, total };
  }
}
