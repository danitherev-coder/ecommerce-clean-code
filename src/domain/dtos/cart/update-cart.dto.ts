


export class UpdateCartDTO {
    constructor(
        public readonly id: string,
        public readonly products: any,
        public readonly cartTotal: number,
        public readonly orderBy: string
    ) { }

    get value() {
        const returnObject: { [key: string]: any } = {};

        if (this.products) returnObject.products = this.products;
        if (this.cartTotal) returnObject.cartTotal = this.cartTotal;
        if (this.orderBy) returnObject.orderBy = this.orderBy;

        return returnObject;
    }


    static create(object: { [key: string]: any }): [string?, UpdateCartDTO?] {

        const { id, _id, products, cartTotal, orderBy } = object;

        if (!id && !_id) return ['Id is required'];
        if (!products) return ['Products Cart is required'];
        if (!cartTotal) return ['CartTotal Cart is required'];
        if (!orderBy) return ['OrderBy Cart is required'];

        return [undefined, new UpdateCartDTO(id || _id, products, cartTotal, orderBy)];

    }
}