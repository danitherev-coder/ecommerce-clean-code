import { Router } from "express";
import { CategoryDataSourceImpl } from "../../domain/infraestructure/datasource/category/category-datasource.impl";
import { CategoryRepositoryImpl } from "../../domain/infraestructure/repositories/category/category-repository.impl";
import { CategoryController } from "./controller";
import { AuthMiddleware } from "../middlewares/verify-jwt";



export class CategoryRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new CategoryDataSourceImpl();
        const repository = new CategoryRepositoryImpl(datasource);
        const controller = new CategoryController(repository);

        // Middleware de verificar jwt
        const verifyJWT = new AuthMiddleware();

        router.get('/hierarchy', controller.getCategoriesHierarchy);
        router.get('/', controller.getAllCategories);
        router.get('/:id', controller.getCategoryById);
        router.post('/', verifyJWT.validateJWT, controller.createCategory);
        router.put('/:id', verifyJWT.validateJWT, controller.updateCategory);
        router.delete('/:id', verifyJWT.validateJWT, controller.deleteCategory);



        return router;
    }
}