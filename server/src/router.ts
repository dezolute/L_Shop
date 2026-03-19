import express, { Application } from 'express';
import { ProductController } from './controllers/products/product.controller';
import { ProductService } from './services/products/product.service';
import { BasketController } from './controllers/basket/basket.controller';
import { BasketService } from './services/basket/basket.service';
import { UserService } from './services/users/user.service';
import { UserController } from './controllers/users/user.controller';
import { SessionService } from './services/sessions/session.service';
import { attachUser } from './middleware/auth';
import { DeliveryController } from './controllers/delivery/delivery.controller';
import { DeliveryService } from './services/delivery/delivery.service';


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

    const userService = new UserService();
    const userController = new UserController(userService, sessionService);

    const deliveryService = new DeliveryService();
    const deliveryController = new DeliveryController(
        deliveryService,
        basketService,
        productService,
    );

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

    userRouter.post('/register', (req, res) => userController.register(req, res));
    userRouter.post('/login', (req, res) => userController.login(req, res));
    userRouter.get('/me', (req, res) => userController.me(req, res));
    userRouter.post('/logout', (req, res) => userController.logout(req, res));

    deliveryRouter.get('/', (req, res) => deliveryController.list(req, res));
    deliveryRouter.post('/', (req, res) => deliveryController.create(req, res));

    app.use('/users', userRouter);
    app.use('/products', productsRouter);
    app.use('/basket', basketRouter);
    app.use('/delivery', deliveryRouter);
}
