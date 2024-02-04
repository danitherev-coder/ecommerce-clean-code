import { CustomError } from "../../index";



export class CouponEntity {
    constructor(
        public readonly id: string,
        public readonly code: string,
        public readonly discount: number,
        public readonly expireAt: Date,
        public readonly products: string[]
    ) { }


    static fromObject(object: { [key: string]: any }): CouponEntity {
        const { id, _id, code, discount, expireAt, products } = object;

        if (!code) throw CustomError.badRequest('Code is required');
        if (isNaN(discount) || !discount) throw CustomError.badRequest('Discount is required - entity');
        if (!expireAt) throw CustomError.badRequest('ExpireAt is required - entity');
        if (!products) throw CustomError.badRequest('Products is required - entity');

        return new CouponEntity(id || _id, code, discount, expireAt, products);
    }
}