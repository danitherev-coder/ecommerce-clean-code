import { CategoryDataSource, CategoryEntity, CategoryRepository, CreateCategoryDto, PaginationDto, UpdateCategoryDto } from '../../../index';




export class CategoryRepositoryImpl implements CategoryRepository {

    constructor(
        private readonly datasource: CategoryDataSource
    ) { }


    getCategoriesHierarchy(catId: string): Promise<{}> {
        return this.datasource.getCategoriesHierarchy(catId);
    }

    getAllCategories(paginationDto: PaginationDto): Promise<{}> {
        return this.datasource.getAllCategories(paginationDto);
    }
    getCategoryById(id: string): Promise<CategoryEntity> {
        return this.datasource.getCategoryById(id);
    }
    createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
        return this.datasource.createCategory(createCategoryDto);
    }
    updateCategory(updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
        return this.datasource.updateCategory(updateCategoryDto);
    }
    deleteCategory(id: string, userId: string): Promise<CategoryEntity> {
        return this.datasource.deleteCategory(id, userId);
    }

}