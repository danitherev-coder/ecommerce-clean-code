import { DeleteProductDTO, ProductEntity, ProductRepository } from "../../index";


export interface DeleteProductUseCase {
    execute(deleteProductDTO: DeleteProductDTO): Promise<ProductEntity>
}

export class DeleteProduct implements DeleteProductUseCase {

    constructor(
        private readonly repository: ProductRepository
    ) { }

    execute(deleteProductDTO: DeleteProductDTO): Promise<ProductEntity> {
        return this.repository.deleteProduct(deleteProductDTO);
    }
}
