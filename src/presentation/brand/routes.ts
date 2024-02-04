import { Router } from "express";
import { BrandDataSourceImpl } from "../../domain/infraestructure/datasource/brand/brand-datasource.impl";
import { BrandRepositoryImpl } from "../../domain/infraestructure/repositories/brand/brand-repository.impl";
import { BrandController } from "./controller";
import { AuthMiddleware } from "../middlewares/verify-jwt";



export class BrandRoutes {
    static get routes(): Router {

        const router: Router = Router();

        const datasource = new BrandDataSourceImpl();
        const repository = new BrandRepositoryImpl(datasource);
        const controller = new BrandController(repository);


        // Middleware de verificar jwt
        const verifyJWT = new AuthMiddleware();

        router.get('/', controller.getAllBrands)
        router.get('/:id', controller.getBrandById)
        router.post('/', verifyJWT.validateJWT, controller.createBrand)
        router.put('/:id', verifyJWT.validateJWT, controller.updateBrand)
        router.delete('/:id', verifyJWT.validateJWT, controller.deleteBrand)
        return router;

    }
}