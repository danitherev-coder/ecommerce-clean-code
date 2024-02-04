import { CartEntity, CartRepository } from "../../index";


export interface ApplyCouponToCartUseCase {
    execute(cartId: string, productsCoupons: { productId: string, couponId: string }[], userId: string): Promise<CartEntity>;
}

export class ApplyCouponToCart implements ApplyCouponToCartUseCase {

    constructor(
        private readonly repository: CartRepository
    ) { }

    execute(cartId: string, productsCoupons: { productId: string, couponId: string }[], userId: string): Promise<CartEntity> {
        return this.repository.applyCouponToCart(cartId, productsCoupons, userId);
    }

}