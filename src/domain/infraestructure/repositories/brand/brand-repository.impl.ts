import { BrandDataSource, BrandEntity, BrandRepository, CreateBrandDto, PaginationDto, UpdateBrandDto } from "../../../index";



export class BrandRepositoryImpl implements BrandRepository {

    constructor(
        private readonly datasource: BrandDataSource
    ) { }

    getAllBrands(paginationDto: PaginationDto): Promise<{}> {
        return this.datasource.getAllBrands(paginationDto);
    }

    getBrandById(id: string): Promise<BrandEntity> {
        return this.datasource.getBrandById(id);
    }

    createBrand(createBrandDto: CreateBrandDto): Promise<BrandEntity> {
        return this.datasource.createBrand(createBrandDto);
    }

    updateBrand(updateBrandDto: UpdateBrandDto): Promise<BrandEntity> {
        return this.datasource.updateBrand(updateBrandDto);
    }

    deleteBrand(id: string, userId: string): Promise<BrandEntity> {
        return this.datasource.deleteBrand(id, userId);
    }
}