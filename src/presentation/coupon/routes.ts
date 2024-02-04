import { Router } from "express";
import { CouponDatasourceImpl } from "../../domain/infraestructure/datasource/coupon/coupon-datasource.impl";
import { CouponRepositoryImpl } from "../../domain/infraestructure/repositories/coupon/coupon-repository.impl";
import { CouponController } from "./controller";
import { AuthMiddleware } from "../middlewares/verify-jwt";

const datasource = new CouponDatasourceImpl();
export const repository = new CouponRepositoryImpl(datasource);
const controller = new CouponController(repository);

// Middleware de verificar jwt
const verifyJWT = new AuthMiddleware();

export class CouponRoutes {
    static get routes(): Router {
        const router: Router = Router();

        router.get('/', controller.getCoupons);
        router.get('/:couponCode', controller.getCoupon);
        router.post('/', verifyJWT.validateJWT, controller.createCoupon);
        router.post('/apply', controller.applyCoupon);
        router.post('/desapply', controller.desApplyCoupon);
        router.post('/create-and-apply', verifyJWT.validateJWT, controller.createAndApplyCoupon);
        router.delete('/', verifyJWT.validateJWT, controller.deleteCoupon);
        return router;
    }
}