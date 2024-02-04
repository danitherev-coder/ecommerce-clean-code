import { CreateProductDTO, CreateWishlistDTO, DeleteProductDTO, PaginationDto, ProductDatasource, ProductEntity, ProductRepository, UpdateProductDTO, WishlistEntity, UploadImagesDTO, UploadImageEntity } from "../../../index";




export class ProductRepositoryImpl implements ProductRepository {

    constructor(
        private readonly datasource: ProductDatasource
    ) { }


    uploadImage(uploadImagesDTO: UploadImagesDTO): Promise<UploadImageEntity> {
        return this.datasource.uploadImage(uploadImagesDTO);
    }


    getProductByBrand(brandId: string, paginationDto: PaginationDto): Promise<{}> {
        return this.datasource.getProductByBrand(brandId, paginationDto);
    }

    getProductByCategory(categoryId: string, paginationDto: PaginationDto): Promise<{}> {
        return this.datasource.getProductByCategory(categoryId, paginationDto);
    }

    getProducts(category: string | undefined, brand: string | undefined, sort: string | undefined, paginationDto: PaginationDto): Promise<{}> {
        return this.datasource.getProducts(category, brand, sort, paginationDto);
    }

    addWishlist(createWishlistDTO: CreateWishlistDTO): Promise<WishlistEntity[]> {
        return this.datasource.addWishlist(createWishlistDTO);
    }

    getProductById(id: string): Promise<ProductEntity> {
        return this.datasource.getProductById(id);
    }

    createProduct(createProductDTO: CreateProductDTO): Promise<ProductEntity> {
        return this.datasource.createProduct(createProductDTO);
    }

    updateProduct(UpdateProductDTO: UpdateProductDTO): Promise<ProductEntity> {
        return this.datasource.updateProduct(UpdateProductDTO);
    }

    deleteProduct(deleteProductDTO: DeleteProductDTO): Promise<ProductEntity> {
        return this.datasource.deleteProduct(deleteProductDTO);
    }
}