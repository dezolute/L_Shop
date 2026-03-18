import { NextFunction, Request, Response } from 'express';
import { SessionService } from '../services/sessions/session.service';

export function attachUser(sessionService: SessionService) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const session = await sessionService.getFromRequest(req);
    if (session) {
      req.userId = session.userId;
    }
    next();
  };
}
