



export class UpdateCouponDTO {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly code: string,
        public readonly discount: number,
        public readonly expireAt: Date,
        public readonly products: string[]
    ) { }


    get values() {
        const returnObject: { [key: string]: any } = {};

        if (this.userId) returnObject.userId = this.userId;
        if (this.code) returnObject.code = this.code;
        if (this.discount) returnObject.discount = this.discount;
        if (this.expireAt) returnObject.expireAt = this.expireAt;
        if (this.products) returnObject.products = this.products;

        return returnObject;
    }

    static update(object: { [key: string]: any }): [string?, UpdateCouponDTO?] {
        const { id, _id, userId, code, discount, expireAt, products } = object;

        if (!id && !_id) return ['Id is required'];
        if (!userId) return ['UserId is required'];
        if (code === '') return ['El codigo no debe ser vacio'];
        if (discount === '') return ['El Descuento no debe ser vacio'];
        if (expireAt === '') return ['Expiracion del cupon no debe estar vacia'];
        if (products !== undefined && typeof products !== 'string') return ['Producto must be a string or null'];

        return [undefined, new UpdateCouponDTO(id || _id, userId, code, discount, expireAt, products)];
    }
}