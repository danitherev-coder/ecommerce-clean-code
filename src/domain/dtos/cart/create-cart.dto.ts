import { CartProduct } from "../../entities/cart/cart.entity";



export class CreateCartDto {
    constructor(
        public readonly id: string,
        public readonly products: CartProduct[],
        public readonly cartTotal?: number,
        public readonly orderBy?: string
    ) { }


    static create(object: { [key: string]: any }): [string?, CreateCartDto?] {

        const { id, _id, products, cartTotal, orderBy } = object;

        if (!products) return ['Products Cart is required'];
        // if (!cartTotal) return ['CartTotal Cart is required'];
        // if (!orderBy) return ['OrderBy Cart is required'];

        return [undefined, new CreateCartDto(id || _id, products, cartTotal, orderBy)];

    }

}