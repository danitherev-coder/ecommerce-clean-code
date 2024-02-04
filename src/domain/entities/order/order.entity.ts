import { CustomError } from "../../index";



export class OrderEntity {
    constructor(
        public id?: string,
        public initPointURL?: string,
        public products?: any[],
        public payment_intent?: any,
        public order_status?: string,
        public isCompleted?: boolean,
        public orderBy?: string
    ) { }


    static fromObject(object: { [key: string]: any }): OrderEntity {
        const { id, _id, initPointURL, products = [], payment_intent, order_status, isCompleted = false, orderBy } = object;

        if (!products) throw CustomError.badRequest('products is required');
        if (!orderBy) throw CustomError.badRequest('orderBy is required');

        return new OrderEntity(id || _id, initPointURL, products, payment_intent, order_status, isCompleted, orderBy);
    }
}