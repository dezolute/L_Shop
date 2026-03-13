import { JsonStore } from '../../storage/json-store';
import { Id, User } from '../../types/models';

export interface RegisterInput {
  name: string;
  email: string;
  login: string;
  phone: string;
  password: string;
}

export interface LoginInput {
  identifier: string;
  password: string;
}

export class UserService {
  private readonly store = new JsonStore<User[]>('users.json', []);

  async register(input: RegisterInput): Promise<User> {
    const users = await this.store.read();
    const exists = users.some(
      (user) =>
        user.email === input.email ||
        user.login === input.login ||
        user.phone === input.phone,
    );
    if (exists) {
      throw new Error('User already exists');
    }
    const user: User = {
      id: this.nextId(users),
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      login: input.login.trim(),
      phone: input.phone.trim(),
      password: input.password,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    await this.store.write(users);
    return user;
  }

  async login(input: LoginInput): Promise<User | null> {
    const users = await this.store.read();
    const identifier = input.identifier.trim().toLowerCase();
    return (
      users.find(
        (user) =>
          (user.email.toLowerCase() === identifier ||
            user.login.toLowerCase() === identifier ||
            user.phone.toLowerCase() === identifier ||
            user.name.toLowerCase() === identifier) &&
          user.password === input.password,
      ) ?? null
    );
  }

  async getById(userId: Id): Promise<User | null> {
    const users = await this.store.read();
    return users.find((user) => user.id === userId) ?? null;
  }

  private nextId(users: User[]): Id {
    return users.length ? Math.max(...users.map((user) => user.id)) + 1 : 1;
  }
}