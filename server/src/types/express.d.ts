import type { Id } from './models';
import 'express-serve-static-core';

declare module 'express-serve-static-core' {
    interface Request {
        userId?: Id;
    }
}

export {};
