import { JsonStore } from '../../storage/json-store';
import { Delivery, Id } from '../../types/models';

export interface DeliveryInput {
  address: string;
  phone: string;
  email: string;
  paymentMethod: 'card' | 'cash' | 'online';
  items: { productId: Id; quantity: number }[];
  total: number;
}

export class DeliveryService {
  private readonly store: JsonStore<Delivery[]> = new JsonStore<Delivery[]>('deliveries.json', []);

  async create(userId: Id, input: DeliveryInput): Promise<Delivery> {
    const deliveries: Delivery[] = await this.store.read();
    const delivery: Delivery = {
      id: this.nextId(deliveries),
      userId,
      items: input.items,
      address: input.address.trim(),
      phone: input.phone.trim(),
      email: input.email.trim().toLowerCase(),
      paymentMethod: input.paymentMethod,
      total: input.total,
      createdAt: new Date().toISOString(),
    };
    deliveries.push(delivery);
    await this.store.write(deliveries);
    return delivery;
  }

  async listByUser(userId: Id): Promise<Delivery[]> {
    const deliveries: Delivery[] = await this.store.read();
    return deliveries.filter((delivery) => delivery.userId === userId);
  }

  private nextId(deliveries: Delivery[]): Id {
    return deliveries.length
      ? Math.max(...deliveries.map((delivery) => delivery.id)) + 1
      : 1;
  }
}
