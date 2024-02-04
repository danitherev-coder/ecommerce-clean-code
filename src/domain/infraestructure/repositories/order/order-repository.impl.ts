import { CreateOrderDto, OrderDatasource, OrderEntity, OrderRepository } from "../../../index";



export class OrderRepositoryImpl implements OrderRepository {

    constructor(
        private readonly datasource: OrderDatasource
    ) { }



    createOrder(createOrderDto: CreateOrderDto): Promise<{ order: OrderEntity, url: string }> {
        return this.datasource.createOrder(createOrderDto);
    }


    receiveWebHook(dataId: string, status: string): Promise<{ msg: string }> {
        return this.datasource.receiveWebHook(dataId, status);
    }

    updateOrderStatus(object: { [key: string]: any; }): Promise<OrderEntity> {
        return this.datasource.updateOrderStatus(object);
    }
}