import { CategoryEntity, CategoryRepository } from "../../index";


export interface GetCategoryUseCase {
    execute(id: string): Promise<CategoryEntity>;
}

export class GetCategory implements GetCategoryUseCase {

    constructor(
        private readonly repository: CategoryRepository
    ) { }

    execute(id: string): Promise<CategoryEntity> {
        return this.repository.getCategoryById(id);
    }
}