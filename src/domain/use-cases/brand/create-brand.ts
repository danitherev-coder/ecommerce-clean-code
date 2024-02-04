import { BrandEntity, BrandRepository, CreateBrandDto } from "../../index";



export interface CreateBrandUseCase {
    execute(createBrandDto: CreateBrandDto): Promise<BrandEntity>;
}

export class CreateBrand implements CreateBrandUseCase {
    constructor(
        private readonly repository: BrandRepository
    ) { }

    execute(createBrandDto: CreateBrandDto): Promise<BrandEntity> {
        return this.repository.createBrand(createBrandDto);
    }
}