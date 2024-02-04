import { BrandEntity, UpdateBrandDto, BrandRepository } from "../../index";


export interface UpdateBrandUseCase {
    execute(updateBrandDto: UpdateBrandDto): Promise<BrandEntity>;
}

export class UpdateBrand implements UpdateBrandUseCase {
    constructor(
        private readonly repository: BrandRepository
    ) { }

    execute(updateBrandDto: UpdateBrandDto): Promise<BrandEntity> {
        return this.repository.updateBrand(updateBrandDto);
    }
}