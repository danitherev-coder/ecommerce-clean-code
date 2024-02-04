import { CreateOrderDto, OrderEntity } from "../../index";




export abstract class OrderRepository {

    // Crear una orden de compra
    abstract createOrder(createOrderDto: CreateOrderDto): Promise<{ order: OrderEntity, url: string }>;
    // esperar respuesta de la pasarela de pago(mercado pago) por medio de un webhook    
    abstract receiveWebHook(dataId: string, status: string): Promise<{ msg: string }>;
    // si la orden fue exitosa, actualizar el estado de la orden
    abstract updateOrderStatus(object: { [key: string]: any }): Promise<OrderEntity>;

}