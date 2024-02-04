import { CartEntity, CartRepository, CreateCartDto } from "../../index";


export interface CreateCartUseCase {
    execute(dto: CreateCartDto): Promise<CartEntity>;
}

export class CreateCart implements CreateCartUseCase {

    constructor(
        private readonly repository: CartRepository
    ) { }

    execute(dto: CreateCartDto): Promise<CartEntity> {
        return this.repository.createCart(dto);
    }

}