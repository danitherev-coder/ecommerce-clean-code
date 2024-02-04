import { CartEntity, UserRepository } from "../../index";

export interface EmptyCartUseCase {
    execute(userId: string): Promise<CartEntity>;
}


export class EmptyCart implements EmptyCartUseCase {

    constructor(
        private readonly repository: UserRepository
    ) { }

    execute(userId: string): Promise<CartEntity> {
        return this.repository.emptyCart(userId);
    }
}