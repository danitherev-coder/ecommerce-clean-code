import { BrandModel, CategoryModel, ProductModel, UserModel } from "../../../../data";
import { CreateProductDTO, CustomError, DeleteProductDTO, PaginationDto, ProductDatasource, ProductEntity, UpdateProductDTO, WishlistEntity, CreateWishlistDTO, UploadImageEntity, UploadImagesDTO } from "../../../index";
import { CloudinaryAdapter } from '../../../../config/index';


export class ProductDatasourceImpl implements ProductDatasource {

    constructor(
        private readonly cloudinaryAdapter: CloudinaryAdapter,
    ) { }



    async uploadImage(uploadImagesDTO: UploadImagesDTO): Promise<UploadImageEntity> {
        //* vamos a obtener la extensión del archivo mediante el mimetype: image/png
        const fileExtension = uploadImagesDTO.file.mimetype.split('/').at(1) ?? ''; // aca estamos cortando el image/ y obteniendo el png o jpg....etc, si no existe, le asignamos un string vacio

        console.log(uploadImagesDTO, 'que obtengo en uploadImagesDTO desde updateProduct');

        //* Aca verificamos la extensión del archivo
        if (!uploadImagesDTO.validExtensions.includes(fileExtension)) {
            throw CustomError.badRequest('Invalid file extension: ' + fileExtension + ', valid ones: ' + uploadImagesDTO.validExtensions.join(', '));
        }

        // Sube el archivo a Cloudinary y guardar en una carpeta específica con el nombre del producto        
        const urls = await this.cloudinaryAdapter.upload([uploadImagesDTO.file], uploadImagesDTO.folder);

        if (urls.length === 0) {
            throw CustomError.badRequest('Failed to upload image to Cloudinary');
        }

        return UploadImageEntity.upload({ url: urls[0] }); // Devuelve la URL de la imagen subida en Cloudinary
    }

    async getProductByBrand(brandId: string, paginationDto: PaginationDto): Promise<{}> {
        const brand = await BrandModel.findById(brandId);
        if (!brand) throw CustomError.notFound('Brand not found');
        console.log(brand.id, 'que id tengo de Brand');



        const { page = 1, limit = 10 } = paginationDto;

        const [totalProducts, products] = await Promise.all([
            ProductModel.countDocuments(),
            ProductModel.find({ brand: brandId })
                .limit(limit)
                .skip((page - 1) * limit).populate('category', 'id name')
        ]);


        // calcular el total de paginas que tendra la paginacion, si existen 5 paginas, si voy a la pagina 2, entonces mostrar que quedan 3 paginas, si voy a la pagina 3 mostrar que quedan 2 paginas
        const totalPages = Math.ceil(totalProducts / limit);
        // calcular cuantas paginas quedan
        const remainingPages = totalPages - page;

        // Verifica si la pagina actual es mayor al total de paginas
        if (page > totalPages) {
            throw CustomError.badRequest('The page you are looking for does not exist');
        }

        return {
            page,
            limit,
            totalProducts,
            totalPages,
            remainingPages,
            nextPage: (page + 1 <= totalPages) ? `/api/v1/products?page=${(page + 1)}&limit=${limit}` : null,
            previusPage: (page - 1 > 0) ? `/api/v1/products?page=${(page - 1)}&limit=${limit}` : null,
            // products: products.map(product => ProductEntity.fromObject(product))
            products

        }
    }

    async getProductByCategory(categoryId: string, paginationDto: PaginationDto): Promise<{}> {
        const category = await CategoryModel.findById(categoryId);
        if (!category) throw CustomError.notFound('Category not found');
        console.log(category.id, 'que id tengo de categoria');



        const { page = 1, limit = 10 } = paginationDto;

        const [totalProducts, products] = await Promise.all([
            ProductModel.countDocuments(),
            ProductModel.find({ category: categoryId })
                .limit(limit)
                .skip((page - 1) * limit).populate('brand', 'id name')
        ]);

        console.log(totalProducts, 'total de productos');
        console.log(products, 'productos');

        // calcular el total de paginas que tendra la paginacion, si existen 5 paginas, si voy a la pagina 2, entonces mostrar que quedan 3 paginas, si voy a la pagina 3 mostrar que quedan 2 paginas
        const totalPages = Math.ceil(totalProducts / limit);
        // calcular cuantas paginas quedan
        const remainingPages = totalPages - page;

        // Verifica si la pagina actual es mayor al total de paginas
        if (page > totalPages) {
            throw CustomError.badRequest('The page you are looking for does not exist');
        }

        return {
            page,
            limit,
            totalProducts,
            totalPages,
            remainingPages,
            nextPage: (page + 1 <= totalPages) ? `/api/v1/products?page=${(page + 1)}&limit=${limit}` : null,
            previusPage: (page - 1 > 0) ? `/api/v1/products?page=${(page - 1)}&limit=${limit}` : null,
            // products: products.map(product => ProductEntity.fromObject(product))
            products

        }
    }

    async getProducts(category: string | undefined, brand: string | undefined, sort: string | undefined, paginationDto: PaginationDto): Promise<{}> {
        const { page = 1, limit = 10 } = paginationDto;

        // Crear un objeto de consulta vacío
        let query: any = {};

        if (category) {
            const categoryExist = await CategoryModel.findById(category);
            if (!categoryExist) throw CustomError.notFound('Category not found');
            // Agregar category al objeto de consulta
            query.category = category;
        }

        if (brand) {
            const brandExist = await BrandModel.findById(brand);
            if (!brandExist) throw CustomError.notFound('Brand not found');
            // Agregar brand al objeto de consulta
            query.brand = brand;
        }

        // Crear un objeto de ordenación vacío
        let sortObj: any = {};

        // Dividir el parámetro sort en campo y dirección
        const [field, direction] = sort!.split(':');

        if (field && direction) {
            // Agregar el campo y la dirección al objeto de ordenación
            sortObj[field] = direction === 'desc' ? -1 : 1;
        }

        const [totalProducts, products] = await Promise.all([
            ProductModel.countDocuments(query),
            ProductModel.find(query)
                .sort(sortObj)
                .limit(limit)
                .skip((page - 1) * limit).populate('category', 'id name').populate('brand', 'id name')
        ])

        // calcular el total de paginas que tendra la paginacion, si existen 5 paginas, si voy a la pagina 2, entonces mostrar que quedan 3 paginas, si voy a la pagina 3 mostrar que quedan 2 paginas
        const totalPages = Math.ceil(totalProducts / limit);
        // calcular cuantas paginas quedan
        const remainingPages = totalPages - page;

        // Verifica si la pagina actual es mayor al total de paginas
        if (page > totalPages) {
            throw CustomError.badRequest('The page you are looking for does not exist');
        }

        return {
            page,
            limit,
            totalProducts,
            totalPages,
            remainingPages,
            nextPage: (page + 1 <= totalPages) ? `/api/v1/products?page=${(page + 1)}&limit=${limit}` : null,
            previusPage: (page - 1 > 0) ? `/api/v1/products?page=${(page - 1)}&limit=${limit}` : null,
            products: products.map(product => ProductEntity.fromObject(product))

        }

    }

    async addWishlist(createWishlistDTO: CreateWishlistDTO): Promise<WishlistEntity[]> {
        try {
            let user = await UserModel.findById(createWishlistDTO.id)
            if (!user) throw CustomError.notFound('User not found');

            const producto = await this.getProductById(createWishlistDTO.product);

            const alreadyAdded = user.wishlist.find((id) => id.toString() == producto.id.toString());
            if (alreadyAdded) {
                user = await UserModel.findByIdAndUpdate(createWishlistDTO.id, {
                    $pull: { wishlist: producto.id },
                }, { new: true })
            } else {
                user = await UserModel.findByIdAndUpdate(createWishlistDTO.id, {
                    $push: { wishlist: producto.id },
                }, { new: true })
            }

            const wishlist = await Promise.all(user!.wishlist.map(async (id) => {
                // convertir el id en string
                let idString = id.toString();
                const product = await this.getProductById(idString);
                return WishlistEntity.fromObject({ product });
            }));
            return wishlist;
        } catch (error) {
            throw error;
        }
    }

    async getProductById(id: string): Promise<ProductEntity> {
        const product = await ProductModel.findById(id);
        if (!product) throw CustomError.notFound('Product not found');

        return ProductEntity.fromObject(product);
    }

    async createProduct(createProductDTO: CreateProductDTO): Promise<ProductEntity> {
        const product = await ProductModel.findOne({ title: createProductDTO.title });
        if (product) throw CustomError.badRequest('Product already exists');

        const existCat = await CategoryModel.findById(createProductDTO.category);
        if (!existCat) throw CustomError.badRequest('Category not found');

        const existBrand = await BrandModel.findById(createProductDTO.brand);
        if (!existBrand) throw CustomError.badRequest('Brand not found');

        // Sube las imágenes y obtén las URLs
        const imageUrls = [];
        for (const image of createProductDTO.images) {

            console.log(image, 'que obtengo en image');

            const uploadImagesDTO = new UploadImagesDTO(image, 'products');
            const uploadedImage = await this.uploadImage(uploadImagesDTO);
            imageUrls.push(uploadedImage.url);
        }

        // Crea el nuevo producto
        const newProduct = new ProductModel(createProductDTO);
        newProduct.images = imageUrls; // Añade las URLs de las imágenes al producto
        // slug
        newProduct.slug = createProductDTO.title.toLowerCase().split(' ').join('-');
        await newProduct.save();

        return ProductEntity.fromObject(newProduct);
    }


    async updateProduct(updateProductDTO: UpdateProductDTO): Promise<ProductEntity> {
        const product = await ProductModel.findById(updateProductDTO.id);
        if (!product) throw CustomError.notFound('Product not found');

        // si el usuario actual no es el author, no puede actualizar el producto
        if (product.author?.toString() != updateProductDTO.userId.toString()) throw CustomError.forbidden('You are not allowed to update this product');

        // slug
        if (updateProductDTO.title) product.slug = updateProductDTO.title.toLowerCase().split(' ').join('-');


        // si viene imagenes, entonces borramos las imagenes anteriores y subimos las nuevas, sino dejamos tal cual esta en base de datos.
        if (updateProductDTO?.images) {
            // Elimina las imágenes existentes
            await Promise.all((product?.images as string[]).map(async (image) => {
                await this.cloudinaryAdapter.delete(image);
                product.images = [];
                await product.save();
            }));

            // Sube las nuevas imágenes y obtén las URLs
            const imageUrls = [];
            for (const image of updateProductDTO.images) {
                const uploadImagesDTO = new UploadImagesDTO(image, 'products');
                const uploadedImage = await this.uploadImage(uploadImagesDTO);
                imageUrls.push(uploadedImage.url);
            }

            // Añade las URLs de las imágenes al producto
            product.images = imageUrls;
            // Actualiza las otras propiedades del producto
            product.title = updateProductDTO.title || product.title;
            product.slug = updateProductDTO.slug || product.slug;
            product.description = updateProductDTO.description || product.description;
            product.price = updateProductDTO.price || product.price;
            product.category = updateProductDTO.category || product.category;
            product.brand = updateProductDTO.brand || product.brand;
            product.quantity = updateProductDTO.quantity || product.quantity;
            if (updateProductDTO.color) {
                product.color = [...product.color, ...updateProductDTO.color];
            }


            // Guarda el producto actualizado
            await product.save();

        }
        return ProductEntity.fromObject(product);
    }

    async deleteProduct(deleteProductDTO: DeleteProductDTO): Promise<ProductEntity> {
        const product = await ProductModel.findById(deleteProductDTO.id);
        if (!product) throw CustomError.notFound('Product not found');

        // si el usuario actual no es el author, no puede eliminar el producto
        if (product.author?.toString() != deleteProductDTO.userId.toString()) throw CustomError.forbidden('You are not allowed to delete this product');

        // eliminar las imagenes del producto
        await Promise.all((product?.images as string[]).map(async (image) => {
            await this.cloudinaryAdapter.delete(image);
            product.images = [];
            await product.save();
        }));

        const deleteProduct = await ProductModel.findByIdAndDelete(product.id);
        if (!deleteProduct) throw CustomError.internalServer('Error deleting product');

        return ProductEntity.fromObject(deleteProduct);
    }

}