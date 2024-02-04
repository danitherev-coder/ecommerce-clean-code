

export class CreateOrderDto {
    constructor(
        public id: string,
        public userId: string,
        public products: any[],
        public payment_intent: any,
        public order_status: string,
        public isCompleted: boolean,
        public orderBy: string
    ) { }



    static create(object: { [key: string]: any }): [string?, CreateOrderDto?] {
        const { id, _id, userId, products = [], payment_intent, order_status, isCompleted = false, orderBy } = object;

        if (!userId) return ['userId is required - dto']
        if (!products) return ['products is required - dto']
        // if (!payment_intent) return ['payment_intent is required - dto'];
        // if (!order_status) return ['order_status is required - dto'];        

        return [undefined, new CreateOrderDto(id || _id, userId, products, payment_intent, order_status, isCompleted, orderBy)];
    }
}