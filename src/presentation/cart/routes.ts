import { Router } from "express";
import { CartDatasourceImpl } from "../../domain/infraestructure/datasource/cart/cart-datasource.impl";
import { CartRepositoryImpl } from "../../domain/infraestructure/repositories/cart/cart-repository.impl";
import { CartController } from "./controller";
import { AuthMiddleware } from "../middlewares/verify-jwt";



export class CartRoutes {
    static get routes(): Router {
        const router: Router = Router();

        const datasource = new CartDatasourceImpl();
        const repository = new CartRepositoryImpl(datasource);
        const controller = new CartController(repository);

        // Middleware de verificar jwt
        const verifyJWT = new AuthMiddleware();


        router.post('/', verifyJWT.validateJWT, controller.createCart);
        router.put('/apply-coupon/:cartId', verifyJWT.validateJWT, controller.applyCouponsToProducts);

        return router;
    }
}