import express, { Application, Request, Response } from 'express';
import { configureRouter } from './router';

const app: Application = express();
const PORT = 3000;

app.use(express.json());

const allowedOrigins = new Set([
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]);

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.has(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Vary', 'Origin');
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    );
    res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    if (req.method === 'OPTIONS') {
        res.status(204).send();
        return;
    }
    next();
});

configureRouter(app);

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});