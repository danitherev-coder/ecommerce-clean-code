import { CategoryEntity, CreateCategoryDto, PaginationDto, UpdateCategoryDto } from "../../index";




export abstract class CategoryRepository {

    abstract getAllCategories(paginationDto: PaginationDto): Promise<{}>
    abstract getCategoryById(id: string): Promise<CategoryEntity>
    abstract createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity>
    abstract updateCategory(updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity>
    abstract deleteCategory(id: string, userId: string): Promise<CategoryEntity>

    abstract getCategoriesHierarchy(catId:string): Promise<{}>
}