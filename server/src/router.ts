import express, { Application } from 'express';
import { ProductController } from './controllers/products/product.controller';
import { ProductService } from './services/products/product.service';
import { BasketController } from './controllers/basket/basket.controller';
import { BasketService } from './services/basket/basket.service';
import { SessionService } from './services/sessions/session.service';
import { attachUser } from './middleware/auth';

const userRouter = express.Router();
const productsRouter = express.Router();
const basketRouter = express.Router();
const deliveryRouter = express.Router();

export function configureRouter(app: Application) {
    const productService = new ProductService();
    const productController = new ProductController(productService);

    const basketService = new BasketService();
    const basketController = new BasketController(basketService, productService);

    const sessionService = new SessionService();

    app.use(attachUser(sessionService));

    productsRouter.get('/', (req, res) => productController.list(req, res));
    productsRouter.get('/:id', (req, res) => productController.getOne(req, res));

    basketRouter.get('/', (req, res) => basketController.get(req, res));
    basketRouter.post('/items', (req, res) => basketController.addItem(req, res));
    basketRouter.patch('/items/:productId', (req, res) =>
        basketController.updateItem(req, res),
    );
    basketRouter.delete('/items/:productId', (req, res) =>
        basketController.removeItem(req, res),
    );

    app.use('/users', userRouter);
    app.use('/products', productsRouter);
    app.use('/basket', basketRouter);
    app.use('/delivery', deliveryRouter);
}
