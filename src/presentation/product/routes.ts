import { Router } from "express";
import { ProductDatasourceImpl } from "../../domain/infraestructure/datasource/product/product-datasource.impl";
import { ProductRepositoryImpl } from "../../domain/infraestructure/repositories/product/product-repository.impl";
import { ProductController } from "./controller";
import { AuthMiddleware } from "../middlewares/verify-jwt";
import { FileUploadMiddleware } from "../middlewares/file-upload.middleware";
import { TypeMiddleware } from "../middlewares/type.middleware";
// import {v4 as uuidV4} from 'uuid';
import { CloudinaryAdapter } from "../../config/cloudinary.adapter";


export class ProductRoutes {
    static get routes(): Router {
        const router: Router = Router();

        const cloudinaryAdapter = new CloudinaryAdapter();
        const datasource = new ProductDatasourceImpl(cloudinaryAdapter);
        const repository = new ProductRepositoryImpl(datasource);
        const controller = new ProductController(repository);


        // Middleware de verificar jwt
        const verifyJWT = new AuthMiddleware();

        // Middlewares de esata ruta
        const filesRequired = FileUploadMiddleware.containFile;
        const types = TypeMiddleware.validTypes(['users', 'products', 'categories', 'type', 'single', 'multiple']);


        // obtener productos por categoria
        router.get('/', controller.getProducts);
        router.get('/category', controller.getProductByCategory);
        router.get('/brand', controller.getProductByBrand);
        router.get('/:id', controller.getProductById);
        router.post('/images/single/:type', controller.uploadImage);
        // router.post('/images/multiple/:type', controller.uploadImages);
        router.post('/images/multiple/:type', [filesRequired, types, verifyJWT.validateJWT], controller.createProduct);
        router.put('/images/multiple/:type/:id', [filesRequired, types, verifyJWT.validateJWT], controller.updateProduct);
        // router.put('/:id', verifyJWT.validateJWT, controller.updateProduct);
        router.delete('/:id', verifyJWT.validateJWT, controller.deleteProduct);

        // agregar a lista de deseos
        router.post('/add-wishlist', verifyJWT.validateJWT, controller.addWishlist);



        return router;
    }
}