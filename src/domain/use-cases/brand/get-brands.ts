import { PaginationDto } from "../../index";



export interface GetBrandsUseCase {
    execute(paginationDto: PaginationDto): Promise<{}>;
}

export class GetBrands implements GetBrandsUseCase {
    constructor(
        private readonly repository: any
    ) { }

    execute(paginationDto: PaginationDto): Promise<{}> {
        return this.repository.getAllBrands(paginationDto);
    }
}