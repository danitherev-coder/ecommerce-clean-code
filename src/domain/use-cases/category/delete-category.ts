import { CategoryEntity, CategoryRepository } from "../../index";


export interface DeleteCategoryUseCase {
    execute(id: string, userId: string): Promise<CategoryEntity>;
}

export class DeleteCategory implements DeleteCategoryUseCase {

    constructor(
        private readonly repository: CategoryRepository
    ) { }

    execute(id: string, userId: string): Promise<CategoryEntity> {
        return this.repository.deleteCategory(id, userId);
    }
}