import { Request, Response } from 'express';
import { UserService } from '../../services/users/user.service';
import { SessionService } from '../../services/sessions/session.service';
import { parseCookies } from '../../utils/cookies';
import { User } from '../../types/models';

const SESSION_TTL_MS = 10 * 60 * 1000;

export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  async register(req: Request, res: Response) {
    try {
      const payload = this.parseRegister(req.body);
      if (!payload) {
        res.status(400).json({ message: 'Invalid payload' });
        return;
      }
      const user = await this.usersService.register(payload);
      const session = await this.sessionService.create(user.id, SESSION_TTL_MS);
      res.cookie('sessionId', session.id, {
        httpOnly: true,
        maxAge: SESSION_TTL_MS,
        sameSite: 'lax',
      });
      res.status(201).json(this.toSafeUser(user));
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const payload = this.parseLogin(req.body);
      if (!payload) {
        res.status(400).json({ message: 'Invalid payload' });
        return;
      }
      const user = await this.usersService.login(payload);
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      const session = await this.sessionService.create(user.id, SESSION_TTL_MS);
      res.cookie('sessionId', session.id, {
        httpOnly: true,
        maxAge: SESSION_TTL_MS,
        sameSite: 'lax',
      });
      res.status(200).json(this.toSafeUser(user));
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async me(req: Request, res: Response) {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const user = await this.usersService.getById(req.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(this.toSafeUser(user));
  }

  async logout(req: Request, res: Response) {
    const cookies = parseCookies(req);
    const sessionId = cookies.sessionId;
    if (sessionId) {
      await this.sessionService.remove(sessionId);
    }
    res.clearCookie('sessionId');
    res.status(204).send();
  }

  private toSafeUser(user: User) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  private parseRegister(body: unknown) {
    if (!body || typeof body !== 'object') {
      return null;
    }
    const data = body as Record<string, unknown>;
    const name = this.asString(data.name);
    const email = this.asString(data.email);
    const login = this.asString(data.login);
    const phone = this.asString(data.phone);
    const password = this.asString(data.password);
    if (!name || !email || !login || !phone || !password) {
      return null;
    }
    return { name, email, login, phone, password };
  }

  private parseLogin(body: unknown) {
    if (!body || typeof body !== 'object') {
      return null;
    }
    const data = body as Record<string, unknown>;
    const identifier = this.asString(data.identifier);
    const password = this.asString(data.password);
    if (!identifier || !password) {
      return null;
    }
    return { identifier, password };
  }

  private asString(value: unknown): string | null {
    if (typeof value !== 'string') {
      return null;
    }
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
  }
}
