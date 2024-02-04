import { PaginationDto, ProductRepository } from "../../index";


export interface GetProductByCategoryUseCase {
    execute(categoryId: string, paginationDto: PaginationDto): Promise<{}>
}

export class GetProductByCategory implements GetProductByCategoryUseCase {

    constructor(
        private readonly repository: ProductRepository
    ) { }

    execute(categoryId: string, paginationDto: PaginationDto): Promise<{}> {
        return this.repository.getProductByCategory(categoryId, paginationDto);
    }
}
