import { BrandEntity,BrandRepository } from "../../index";


export interface GetBrandUseCase {
    execute(id: string): Promise<BrandEntity>;
}

export class GetBrand implements GetBrandUseCase {
    constructor(
        private readonly repository: BrandRepository
    ) { }

    execute(id: string): Promise<BrandEntity> {
        return this.repository.getBrandById(id);
    }
}