import { CartEntity, CreateCartDto } from '../../index';




export abstract class CartRepository {
    abstract createCart(createCartDto: CreateCartDto): Promise<CartEntity>;
    abstract applyCouponToCart(cartId: string, productsCoupons: { productId: string, couponId: string }[], userId: string): Promise<CartEntity>;
    // abstract applyCouponToCart(cartId: string, productId: string, couponId: string, userId: string): Promise<CartEntity>;
}