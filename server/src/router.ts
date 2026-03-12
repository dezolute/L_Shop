import express, { Application } from 'express';

const userRouter = express.Router();
const productsRouter = express.Router();
const basketRouter = express.Router();
const deliveryRouter = express.Router();

export function configureRouter(app: Application) {
    app.use('/users', userRouter);
    app.use('/products', productsRouter);
    app.use('/basket', basketRouter);
    app.use('/delivery', deliveryRouter);
}
