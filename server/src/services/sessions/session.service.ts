import crypto from 'crypto';
import { JsonStore } from '../../storage/json-store';
import { Session, Id } from '../../types/models';
import { parseCookies } from '../../utils/cookies';
import { Request } from 'express';

export class SessionService {
    private readonly store = new JsonStore<Session[]>('sessions.json', []);

    private async cleanupExpired(sessions: Session[]): Promise<Session[]> {
        const now = Date.now();
        const active = sessions.filter(
            (session) => new Date(session.expiresAt).getTime() > now,
        );
        if (active.length !== sessions.length) {
            await this.store.write(active);
        }
        return active;
    }

    async create(userId: Id, ttlMs: number): Promise<Session> {
        const sessions = await this.cleanupExpired(await this.store.read());
        const session: Session = {
            id: crypto.randomBytes(24).toString('hex'),
            userId,
            expiresAt: new Date(Date.now() + ttlMs).toISOString(),
        };
        sessions.push(session);
        await this.store.write(sessions);
        return session;
    }

    async remove(sessionId: string): Promise<void> {
        const sessions = await this.store.read();
        const filtered = sessions.filter((session) => session.id !== sessionId);
        await this.store.write(filtered);
    }

    async getById(sessionId: string): Promise<Session | null> {
        const sessions = await this.cleanupExpired(await this.store.read());
        return sessions.find((session) => session.id === sessionId) ?? null;
    }

    async getFromRequest(req: Request): Promise<Session | null> {
        const cookies = parseCookies(req);
        const sessionId = cookies.sessionId;
        if (!sessionId) {
            return null;
        }
        return this.getById(sessionId);
    }
}
