import { CustomError, ProductEntity } from "../../index";

export class WishlistEntity {
    constructor(
        // public readonly product: string, // ID del producto
        public readonly product?: ProductEntity
    ) { }

    static fromObject(object: { [key: string]: any }): WishlistEntity {
        const { product } = object;

        if (!product) throw CustomError.badRequest('Product is required');

        return new WishlistEntity(product);
    }
}