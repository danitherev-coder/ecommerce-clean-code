import { PaginationDto, ProductRepository } from "../../index";


export interface GetProductByBrandUseCase {
    execute(brandId: string, paginationDto: PaginationDto): Promise<{}>
}

export class GetProductByBrand implements GetProductByBrandUseCase {

    constructor(
        private readonly repository: ProductRepository
    ) { }

    execute(brandId: string, paginationDto: PaginationDto): Promise<{}> {
        return this.repository.getProductByBrand(brandId, paginationDto);
    }
}
