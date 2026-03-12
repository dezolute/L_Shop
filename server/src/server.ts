import express, { Application, Request, Response } from 'express';
import { configureRouter } from './router';

const app: Application = express();
const PORT = 3000;

app.use(express.json());

configureRouter(app);

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});