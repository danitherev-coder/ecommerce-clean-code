import { ProductEntity, ProductRepository, UpdateProductDTO } from "../../index";


export interface UpdateProductUseCase {
    execute(UpdateProductDTO: UpdateProductDTO): Promise<ProductEntity>
}

export class UpdateProduct implements UpdateProductUseCase {

    constructor(
        private readonly repository: ProductRepository
    ) { }

    execute(UpdateProductDTO: UpdateProductDTO): Promise<ProductEntity> {
        return this.repository.updateProduct(UpdateProductDTO);
    }
}
