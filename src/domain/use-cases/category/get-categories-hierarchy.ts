import { CategoryRepository } from "../../index";


export interface GetCategoriesHierarchyUseCase {
    execute(catId: string): Promise<{}>;
}

export class GetCategoriesHierarchy implements GetCategoriesHierarchyUseCase {

    constructor(
        private readonly repository: CategoryRepository
    ) { }

    execute(catId: string): Promise<{}> {
        return this.repository.getCategoriesHierarchy(catId);
    }
}