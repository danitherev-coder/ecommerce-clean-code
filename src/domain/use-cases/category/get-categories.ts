import { CategoryRepository, PaginationDto } from "../../index";


export interface GetCategoriesUseCase {
    execute(paginationDto: PaginationDto): Promise<{}>;
}

export class GetCategories implements GetCategoriesUseCase {

    constructor(
        private readonly repository: CategoryRepository
    ) { }

    execute(paginationDto: PaginationDto): Promise<{}> {
        return this.repository.getAllCategories(paginationDto);
    }
}