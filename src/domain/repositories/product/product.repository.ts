import { CreateProductDTO, CreateWishlistDTO, DeleteProductDTO, PaginationDto, ProductEntity, UpdateProductDTO, WishlistEntity, UploadImagesDTO, UploadImageEntity } from '../../index';



export abstract class ProductRepository {
    // agregar productos a lista de deseos
    abstract addWishlist(createWishlistDTO: CreateWishlistDTO): Promise<WishlistEntity[]>;
    abstract createProduct(createProductDTO: CreateProductDTO): Promise<ProductEntity>;
    abstract deleteProduct(deleteProductDTO: DeleteProductDTO): Promise<ProductEntity>;
    abstract getProductByBrand(brandId: string, paginationDto: PaginationDto): Promise<{}>;
    abstract getProductByCategory(categoryId: string, paginationDto: PaginationDto): Promise<{}>;
    abstract getProductById(id: string): Promise<ProductEntity>;
    abstract getProducts(category: string | undefined, brand: string | undefined, sort: string | undefined, paginationDto: PaginationDto): Promise<{}>;
    // abstract getProducts(paginationDto: PaginationDto): Promise<{}>;
    abstract updateProduct(UpdateProductDTO: UpdateProductDTO): Promise<ProductEntity>;
    // subir imagen de producto
    abstract uploadImage(uploadImagesDTO: UploadImagesDTO): Promise<UploadImageEntity>;
}