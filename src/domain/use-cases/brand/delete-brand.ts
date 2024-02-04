import { BrandEntity,BrandRepository } from "../../index";


export interface DeleteBrandUseCase {
    execute(id: string, userId: string): Promise<BrandEntity>;
}

export class DeleteBrand implements DeleteBrandUseCase {
    constructor(
        private readonly repository: BrandRepository
    ) { }

    execute(id: string, userId: string): Promise<BrandEntity> {
        return this.repository.deleteBrand(id, userId);
    }
}