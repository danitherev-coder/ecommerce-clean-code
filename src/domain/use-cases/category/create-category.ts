import { CategoryEntity, CategoryRepository, CreateCategoryDto } from "../../index";


export interface CreateCategoryUseCase {
    execute(dto: CreateCategoryDto): Promise<CategoryEntity>;
}

export class CreateCategory implements CreateCategoryUseCase {

    constructor(
        private readonly repository: CategoryRepository
    ) { }

    execute(dto: CreateCategoryDto): Promise<CategoryEntity> {
        return this.repository.createCategory(dto);
    }
}