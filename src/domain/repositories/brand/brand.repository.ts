import { CreateBrandDto, BrandEntity, UpdateBrandDto, PaginationDto } from '../../index';




export abstract class BrandRepository {

    abstract getAllBrands(paginationDto: PaginationDto): Promise<{}>;
    abstract getBrandById(id: string): Promise<BrandEntity>;
    abstract createBrand(createBrandDto: CreateBrandDto): Promise<BrandEntity>;
    abstract updateBrand(updateBrandDto: UpdateBrandDto): Promise<BrandEntity>;
    abstract deleteBrand(id: string, userId: string): Promise<BrandEntity>;
}