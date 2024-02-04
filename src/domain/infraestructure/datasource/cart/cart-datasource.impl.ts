import { CartModel, CouponModel, ProductModel, UserModel } from "../../../../data";
import { CartDatasource, CartEntity, CreateCartDto, CustomError } from "../../../index";

import { Types } from 'mongoose';

interface IProduct {
    id: string;
    title: string;
    images: string[];
    price: number;
    discountedPrice: number;
}

interface ICoupon {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    products: Types.ObjectId[];
    code?: string;
    author?: Types.ObjectId;
    discount?: number;
    expireAt?: Date;
}

export class CartDatasourceImpl implements CartDatasource {

    async applyCouponToCart(cartId: string, productsCoupons: { productId: string, couponId: string }[], userId: string): Promise<CartEntity> {
        const cart = await CartModel.findById(cartId);
        if (!cart) throw CustomError.badRequest('Cart not found');

        if (cart.orderBy!.toString() !== userId.toString()) {
            throw CustomError.forbidden('You do not have permission to update this cart');
        }

        for (const { productId, couponId } of productsCoupons) {

            console.log(couponId, 'que couponId obtengo');

            const coupon = await CouponModel.findById(couponId) as ICoupon;                        
            if (!coupon) throw CustomError.badRequest(`Invalid coupon code` + couponId);
            // if (!coupon) {
            //     console.log(`Invalid coupon code ${couponId}. Skipping this coupon.`);
            //     continue;
            // }

            // Apply the coupon to the product            

            const product = cart.products.find(p => p._id.toString() === productId.toString());
            console.log(product, 'producto');            
            // Apply the coupon to the product
            // product.discountedPrice = product.price * (1 - coupon?.discount! / 100);
            // product.coupon = coupon.id;
            const productDocument = await ProductModel.findById(productId).select('title').exec();
            if (!product) throw CustomError.badRequest(`Product ${productDocument?.title} not found in cart`);
            // Check if the product already has a discounted price
            if (product.discountedPrice > 0) {
                console.log(`Product ${productDocument?.title} already has a discounted price`);
                continue; // Skip to the next iteration
            }            

            // Check if the coupon has already been applied to the product
            if (product.coupon) {
                if (product.coupon.toString() === couponId) {
                    console.log(`Coupon already applied to product ${productDocument?.title}`);
                    continue; // Skip to the next iteration
                }
                continue; // Skip to the next iteration
            }

            const objectId = new Types.ObjectId(productId); // Convert string to ObjectId
            if (coupon.products.includes(objectId)) {
                if (typeof coupon.discount === 'number') {
                    const discountDecimal = coupon.discount / 100;
                    const originalPrice = product.price;
                    product.discountedPrice = +((product.price - (product.price * discountDecimal)).toFixed(2));
                    product.coupon = coupon.id; // Apply coupon to product

                    console.log(`Applied coupon to product ${productDocument?.title}. Original price: ${originalPrice}, Discounted price: ${product.discountedPrice}`);
                }
            }
        }

        // Recalculate the cart total after applying the coupons
        cart.cartTotal = cart.products.reduce((total, product) => {
            // Use discounted price if it exists, otherwise use the original price
            const priceToUse = product.discountedPrice > 0 ? product.discountedPrice : product.price;
            return total + priceToUse;
        }, 0);

        await cart.save();

        return CartEntity.fromObject(cart);
    }

    async createCart(createCartDto: CreateCartDto): Promise<CartEntity> {
        const user = createCartDto.orderBy;
        const existUser = await UserModel.findById(user);
        if (!existUser) throw CustomError.notFound('User not found');

        const alreadyExistCart = await CartModel.findOne({ orderBy: user });
        if (alreadyExistCart) await alreadyExistCart.deleteOne();

        const products = await Promise.all(createCartDto.products.map(async (productDto) => {
            const productDocument = await ProductModel.findById(productDto.id).select('title images price discountedPrice').exec();
            if (!productDocument) {
                throw CustomError.notFound('Product not found');
            }
            const product: IProduct = productDocument as IProduct;
            return {
                _id: productDto.id,
                name: product.title,
                images: product.images[0],
                count: productDto.count,
                discountedPrice: product.discountedPrice,
                color: productDto.color,
                price: product.discountedPrice !== 0 ? product.discountedPrice : product.price
            };
        }));        

        const cartTotal = products.reduce((total, product) => total + product.price * product.count, 0);

        const newCart = new CartModel({
            products,
            cartTotal: cartTotal,
            orderBy: createCartDto.orderBy
        });

        await newCart.save();

        return CartEntity.fromObject(newCart);
    }

}