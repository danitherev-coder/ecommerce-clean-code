import { Router } from "express";
import { UserController } from "./controller";
import { UserDataSourceImpl } from "../../domain/infraestructure/datasource/user/user-datasource.impl";
import { UserRepositoryImpl } from "../../domain/infraestructure/repositories/user/user-repository.impl";
import { AuthMiddleware } from "../middlewares/verify-jwt";


export class UserRoutes {
    static get routes(): Router {

        const router: Router = Router();
        const datasource = new UserDataSourceImpl();
        const repository = new UserRepositoryImpl(datasource);
        const controller = new UserController(repository);


        // Middleware de verificar jwt
        const verifyJWT = new AuthMiddleware();

        router.get('/', controller.getAllUser);
        router.get('/:id', controller.getUser);
        // obtener mi carrito de compras
        router.get('/cart/:cartId', verifyJWT.validateJWT, controller.getUserCart);
        // vaciar carrito de compras
        router.delete('/empty-cart', verifyJWT.validateJWT, controller.emptyCart);
        router.put('/:id', verifyJWT.validateJWT, controller.updateUser);
        router.delete('/:id', verifyJWT.validateJWT, controller.deleteUser);

        // Ruta de agregar direccion - address
        router.post('/address/:id', verifyJWT.validateJWT, controller.addAddress);
        router.put('/address/:id', verifyJWT.validateJWT, controller.updateAddress);
        router.delete('/address/:id', verifyJWT.validateJWT, controller.deleteAddress);

        return router;
    }
}