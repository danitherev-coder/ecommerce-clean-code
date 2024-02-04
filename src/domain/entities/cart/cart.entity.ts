import { CustomError } from "../../index";


export interface CartProduct {
    id: string;
    name: string;
    images: string;
    count: number;
    discountedPrice: number;
    color: string;
    price: number;
}


export class CartEntity {
    constructor(
        public readonly id: string,
        public readonly products: CartProduct[],
        public readonly cartTotal: number,
        public readonly orderBy: string
    ) { }

    static fromObject(object: { [key: string]: any }): CartEntity {
        const { id, _id, products, cartTotal, orderBy } = object;

        if (!products) throw CustomError.badRequest('Products Cart is required');
        if (!cartTotal) throw CustomError.badRequest('CartTotal Cart is required');
        if (!orderBy) throw CustomError.badRequest('OrderBy Cart is required');

        return new CartEntity(id || _id, products, cartTotal, orderBy);
    }
}