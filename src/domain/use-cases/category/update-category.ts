import { CategoryEntity, CategoryRepository, UpdateCategoryDto } from "../../index";


export interface UpdateCategoryUseCase {
    execute(dto: UpdateCategoryDto): Promise<CategoryEntity>;
}

export class UpdateCategory implements UpdateCategoryUseCase {

    constructor(
        private readonly repository: CategoryRepository
    ) { }

    execute(dto: UpdateCategoryDto): Promise<CategoryEntity> {
        return this.repository.updateCategory(dto);
    }
}