import { CartDatasource, CartEntity, CartRepository, CreateCartDto } from "../../../index";




export class CartRepositoryImpl implements CartRepository {

    constructor(
        private readonly datasource: CartDatasource
    ) { }

    createCart(createCartDto: CreateCartDto): Promise<CartEntity> {
        return this.datasource.createCart(createCartDto);
    }

    applyCouponToCart(cartId: string, productsCoupons: { productId: string, couponId: string }[], userId: string): Promise<CartEntity> {
        return this.datasource.applyCouponToCart(cartId, productsCoupons, userId);
    }
}