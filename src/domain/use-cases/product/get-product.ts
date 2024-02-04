import { ProductEntity, ProductRepository } from "../../index";


export interface GetProductUseCase {
    execute(id: string): Promise<ProductEntity>
}

export class GetProduct implements GetProductUseCase {

    constructor(
        private readonly repository: ProductRepository
    ) { }

    execute(id: string): Promise<ProductEntity> {
        return this.repository.getProductById(id);
    }
}
