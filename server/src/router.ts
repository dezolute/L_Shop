import express, { Application } from 'express';
import { ProductController } from './controllers/products/product.controller';
import { ProductService } from './services/products/product.service';

const userRouter = express.Router();
const productsRouter = express.Router();
const basketRouter = express.Router();
const deliveryRouter = express.Router();

export function configureRouter(app: Application) {
    const productService = new ProductService();
    const productController = new ProductController(productService);
    
    productsRouter.get('/', (req, res) => productController.list(req, res));
    productsRouter.get('/:id', (req, res) => productController.getOne(req, res));

    app.use('/users', userRouter);
    app.use('/products', productsRouter);
    app.use('/basket', basketRouter);
    app.use('/delivery', deliveryRouter);
}
