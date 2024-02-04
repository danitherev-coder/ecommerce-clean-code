import { CreateOrderDto, OrderEntity, OrderRepository } from "../../index";


export interface CreateOrderUseCase {
    execute(createOrderDto: CreateOrderDto): Promise<{ order: OrderEntity, url: string }>
}

export class CreateOrder implements CreateOrderUseCase {

    constructor(
        private readonly repository: OrderRepository
    ) { }

    execute(createOrderDto: CreateOrderDto): Promise<{ order: OrderEntity, url: string }> {
        return this.repository.createOrder(createOrderDto);
    }

}