import { CreateProductDTO, ProductEntity, ProductRepository } from "../../index";


export interface CreateProductUseCase {
    execute(createProductDTO: CreateProductDTO): Promise<ProductEntity>
}

export class CreateProduct implements CreateProductUseCase {

    constructor(
        private readonly repository: ProductRepository
    ) { }

    execute(createProductDTO: CreateProductDTO): Promise<ProductEntity> {
        return this.repository.createProduct(createProductDTO);
    }
}
