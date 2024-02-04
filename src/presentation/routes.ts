import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { UserRoutes } from "./user/routes";
import { CategoryRoutes } from "./category/routes";
import { BrandRoutes } from "./brand/routes";
import { ProductRoutes } from "./product/routes";
import { CouponRoutes } from "./coupon/routes";
import { CartRoutes } from "./cart/routes";
import { OrderRoutes } from "./order/routes";



export class AppRoutes {
    static get routes() {

        const router = Router();

        router.use('/api/v1/auth', AuthRoutes.routes);
        router.use('/api/v1/users', UserRoutes.routes);
        router.use('/api/v1/categories', CategoryRoutes.routes);
        router.use('/api/v1/brands', BrandRoutes.routes);
        router.use('/api/v1/products', ProductRoutes.routes);
        router.use('/api/v1/coupons', CouponRoutes.routes);
        router.use('/api/v1/cart', CartRoutes.routes);
        router.use('/api/v1/orders', OrderRoutes.routes);
        return router;
    }
}