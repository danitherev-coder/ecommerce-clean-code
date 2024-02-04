import { Router } from "express";
import { AuthMiddleware } from "../middlewares/verify-jwt";
import { OrderController } from "./controller";
import { OrderDatasourceImpl } from "../../domain/infraestructure/datasource/order/order-datasource.impl";
import { OrderRepositoryImpl } from "../../domain/infraestructure/repositories/order/order-repository.impl";





export class OrderRoutes {


    static get routes(): Router {
        const router: Router = Router();



        // Middleware de verificar jwt
        const verifyJWT = new AuthMiddleware();
        const datasource = new OrderDatasourceImpl();
        const repository = new OrderRepositoryImpl(datasource);
        const controller = new OrderController(repository);

        // ruta de crear orden de compra
        router.post('/create-order', verifyJWT.validateJWT, controller.createOrder);
        router.post('/webhook', controller.receiveWebHook);
        router.get('/success', controller.successOrder);
        router.get('/failure', controller.failureOrder);
        router.get('/pending', controller.pendingOrder);

        return router;
    }

}