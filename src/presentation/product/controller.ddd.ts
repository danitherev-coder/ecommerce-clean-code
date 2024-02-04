import { Request, Response } from "express";
import { UploadedFile } from 'express-fileupload';
import cloudinary from 'cloudinary';
import { CreateProductDTO, CreateWishlistDTO, DeleteProductDTO, PaginationDto, ProductRepository, UpdateProductDTO, UploadImagesDTO } from "../../domain";
import { handleErrors } from "../errorHandler/errorHandler";

cloudinary.v2.config({
    cloud_name: 'dpyr2wyaf',
    api_key: '846634682136411',
    api_secret: 'q3mJGEPShDL5r92iI5C_hCoEh6I',
    // secure: true
})

export class ProductController {
    constructor(
        private readonly repository: ProductRepository
    ) { }



    getProducts = async (req: Request, res: Response) => {
        const { page = '1', limit = '10' } = req.query;
        let category = req.query.category;
        let brand = req.query.brand;
        let sort = req.query.sort || 'price:asc';;

        // Comprobar que category y brand son strings
        if (typeof category !== 'string') category = undefined;
        if (typeof brand !== 'string') brand = undefined;
        if (typeof sort !== 'string') sort = 'price:asc';;
        try {
            const [error, paginationDto] = PaginationDto.create(+page, +limit);
            if (error) return res.status(400).json({ error });

            const products = await this.repository.getProducts(category, brand, sort, paginationDto!);

            return res.status(200).json(products);

        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    getProductById = async (req: Request, res: Response) => {
        try {
            const product = await this.repository.getProductById(req.params.id);

            return res.status(200).json(product);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    createProduct = async (req: Request, res: Response) => {
        const author = req.body.user.id;
        const files = req.body.files as UploadedFile[];
        const type = req.params.type;

        try {
            // Sube todas las imágenes y obtén las URLs
            const uploads = await Promise.all(files.map(async file => {
                const [error, uploadImagesDTO] = UploadImagesDTO.upload({ file, folder: type });
                if (error) return res.status(400).json({ error });

                return uploadImagesDTO!.file; // Devuelve la URL de la imagen subida
            }));

            // Crea el DTO del producto con las URLs de las imágenes
            const [error, createProductDTO] = CreateProductDTO.create({ author, images: uploads, ...req.body });
            if (error) return res.status(400).json({ error });

            // Crea el producto
            const product = await this.repository.createProduct(createProductDTO!);

            return res.status(201).json(product);

        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }


    updateProduct = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.body.user.id;
        const files = req.body.files as UploadedFile[];
        const type = req.params.type;
        try {

            // Sube todas las imágenes y obtén las URLs
            const uploads = await Promise.all(files?.map(async file => {
                const [error, uploadImagesDTO] = UploadImagesDTO.upload({ file, folder: type });
                if (error) return res.status(400).json({ error });

                return uploadImagesDTO!.file; // Devuelve la URL de la imagen subida
            }));

            const [error, updateProductDTO] = UpdateProductDTO.update({ images: uploads, id, userId, ...req.body });
            if (error) return res.status(400).json({ error });

            const product = await this.repository.updateProduct(updateProductDTO!);

            return res.status(200).json(product);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    deleteProduct = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.body.user.id;
        try {
            const [error, deleteProductDTO] = DeleteProductDTO.delete({ id, userId });
            if (error) return res.status(400).json({ error });

            const product = await this.repository.deleteProduct(deleteProductDTO!);

            return res.status(200).json(product);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    addWishlist = async (req: Request, res: Response) => {

        const id = req.body.user.id;
        const { product } = req.body
        try {
            const [error, createWishlistDTO] = CreateWishlistDTO.create({ product, id });
            if (error) return res.status(400).json({ error });

            const wishlist = await this.repository.addWishlist(createWishlistDTO!);

            return res.status(200).json(wishlist);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    getProductByCategory = async (req: Request, res: Response) => {
        try {
            const catId = req.body.catId;
            const { page = 1, limit = 10 } = req.query;
            const [error, paginationDto] = PaginationDto.create(+page, +limit);
            if (error) return res.status(400).json({ error });

            const products = await this.repository.getProductByCategory(catId, paginationDto!);

            return res.status(200).json(products);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    getProductByBrand = async (req: Request, res: Response) => {
        try {
            const brandId = req.body.brandId;
            const { page = 1, limit = 10 } = req.query;
            const [error, paginationDto] = PaginationDto.create(+page, +limit);
            if (error) return res.status(400).json({ error });

            const products = await this.repository.getProductByBrand(brandId, paginationDto!);

            return res.status(200).json(products);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    uploadImage = async (req: Request, res: Response) => {
        const type = req.params.type;
        console.log(type, 'que type tengo');
        const file = req.body.files.at(0) as UploadedFile;

        try {

            const [error, uploadImagesDTO] = UploadImagesDTO.upload({ file, folder: type });
            if (error) return res.status(400).json({ error });

            const upload = await this.repository.uploadImage(uploadImagesDTO!);

            console.log(upload, 'upload');

            return res.status(200).json(upload);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    uploadImages = async (req: Request, res: Response) => {
        const type = req.params.type;
        const files = req.body.files as UploadedFile[];

        try {
            const uploads = await Promise.all(files.map(async file => {
                const [error, uploadImagesDTO] = UploadImagesDTO.upload({ file, folder: type });
                if (error) return res.status(400).json({ error });

                const upload = await this.repository.uploadImage(uploadImagesDTO!);

                return upload;
            }));

            return res.status(200).json(uploads);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }
}