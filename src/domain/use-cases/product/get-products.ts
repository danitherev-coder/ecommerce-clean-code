import { PaginationDto, ProductRepository } from "../../index";


export interface GetProductsUseCase {
    execute(category: string | undefined, brand: string | undefined, sort: string | undefined, paginationDto: PaginationDto): Promise<{}>
}

export class GetProducts implements GetProductsUseCase {

    constructor(
        private readonly repository: ProductRepository
    ) { }

    execute(category: string | undefined, brand: string | undefined, sort: string | undefined, paginationDto: PaginationDto): Promise<{}> {
        return this.repository.getProducts(category, brand, sort, paginationDto);
    }
}
