// import { ProductEntity } from "../../index";



export class CreateWishlistDTO {
    constructor(
        public readonly id: string,
        public readonly product: string, // ID del producto
        // public readonly product: ProductEntity, // producto entero
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateWishlistDTO?] {
        const { id, product } = object;
        if (!product) return ['product is required - dto'];
        return [undefined, new CreateWishlistDTO(id, product)];
    }
}