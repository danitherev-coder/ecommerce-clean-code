import { CartEntity, UserRepository } from "../../index";

export interface GetUserCartUseCase {
    execute(userId: string, cartId: string): Promise<CartEntity>;
}


export class GetUserCart implements GetUserCartUseCase {

    constructor(
        private readonly repository: UserRepository
    ) { }

    execute(userId: string, cartId: string): Promise<CartEntity> {
        return this.repository.getUserCart(userId, cartId);
    }
}