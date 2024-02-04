import { CreateProductDTO, CreateWishlistDTO, DeleteProductDTO, PaginationDto, ProductEntity, UploadImageEntity, UpdateProductDTO, UploadImagesDTO, WishlistEntity } from '../../index';



export abstract class ProductDatasource {

    abstract getProducts(category: string | undefined, brand: string | undefined, sort: string | undefined, paginationDto: PaginationDto): Promise<{}>;
    // abstract getProducts(paginationDto: PaginationDto): Promise<{}>;
    abstract getProductById(id: string): Promise<ProductEntity>;
    abstract createProduct(createProductDTO: CreateProductDTO): Promise<ProductEntity>;
    abstract updateProduct(UpdateProductDTO: UpdateProductDTO): Promise<ProductEntity>;
    abstract deleteProduct(deleteProductDTO: DeleteProductDTO): Promise<ProductEntity>;

    // trear productos por categoria
    abstract getProductByCategory(categoryId: string, paginationDto: PaginationDto): Promise<{}>;
    // traer productos por marca (BRAND)
    abstract getProductByBrand(brandId: string, paginationDto: PaginationDto): Promise<{}>;
    // agregar productos a lista de deseos
    abstract addWishlist(createWishlistDTO: CreateWishlistDTO): Promise<WishlistEntity[]>;

    // subir imagen de producto
    abstract uploadImage(uploadImagesDTO: UploadImagesDTO): Promise<UploadImageEntity>;

}