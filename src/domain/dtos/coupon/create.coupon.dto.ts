


export class CreateCouponDTO {
    constructor(
        public readonly id: string,
        public readonly author: string,
        public readonly code: string,
        public readonly discount: number,
        public readonly expireAt: Date,
        public readonly products: string[]
    ) { }


    static create(object: { [key: string]: any }): [string?, CreateCouponDTO?] {

        const { id, _id, author, code, discount, expireAt, products } = object;

        if (!author) return ['Author is required'];
        if (!code) return ['Code is required'];
        if (isNaN(discount) || !discount) return ['Discount is required'];
        if(typeof discount !== 'number') return ['Discount must be a number']
        if (!expireAt) return ['ExpireAt is required'];
        if (!products) return ['Products is required'];

        return [undefined, new CreateCouponDTO(id || _id, author, code, discount, expireAt, products)];
    }

}