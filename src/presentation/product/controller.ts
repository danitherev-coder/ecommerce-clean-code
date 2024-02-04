import { Request, Response } from "express";
import { UploadedFile } from 'express-fileupload';
import cloudinary from 'cloudinary';
import { AddWishlist, CreateProduct, CreateProductDTO, CreateWishlistDTO, DeleteProduct, DeleteProductDTO, GetProduct, GetProductByBrand, GetProductByCategory, GetProducts, PaginationDto, ProductRepository, UpdateProduct, UpdateProductDTO, UploadImage, UploadImagesDTO } from "../../domain";
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



    getProducts = (req: Request, res: Response) => {
        const { page = '1', limit = '10' } = req.query;
        let category = req.query.category;
        let brand = req.query.brand;
        let sort = req.query.sort || 'price:asc';;

        // Comprobar que category y brand son strings
        if (typeof category !== 'string') category = undefined;
        if (typeof brand !== 'string') brand = undefined;
        if (typeof sort !== 'string') sort = 'price:asc';;

        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        new GetProducts(this.repository).execute(category, brand, sort, paginationDto!)
            .then(categories => { res.status(200).json(categories) })
            .catch(error => handleErrors(error, res));

        return;
    }

    getProductById = (req: Request, res: Response) => {
        const id = req.params.id;

        new GetProduct(this.repository).execute(id)
            .then(product => { res.status(200).json(product) })
            .catch(error => handleErrors(error, res));
    }

    createProduct = async (req: Request, res: Response) => {
        const author = req.body.user.id;
        const files = req.body.files as UploadedFile[];
        const type = req.params.type;


        // Sube todas las imágenes y obtén las URLs
        const uploads = await Promise.all(files.map(async file => {
            const [error, uploadImagesDTO] = UploadImagesDTO.upload({ file, folder: type });
            if (error) return res.status(400).json({ error });

            return uploadImagesDTO!.file; // Devuelve la URL de la imagen subida
        }));

        // Crea el DTO del producto con las URLs de las imágenes
        const [error, createProductDTO] = CreateProductDTO.create({ author, images: uploads, ...req.body });
        if (error) return res.status(400).json({ error });

        new CreateProduct(this.repository).execute(createProductDTO!)
            .then(product => { res.status(201).json(product) })
            .catch(error => handleErrors(error, res));

        return;
    }


    updateProduct = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.body.user.id;
        const files = req.body.files as UploadedFile[];
        const type = req.params.type;


        // Sube todas las imágenes y obtén las URLs
        const uploads = await Promise.all(files?.map(async file => {
            const [error, uploadImagesDTO] = UploadImagesDTO.upload({ file, folder: type });
            if (error) return res.status(400).json({ error });

            return uploadImagesDTO!.file; // Devuelve la URL de la imagen subida
        }));

        const [error, updateProductDTO] = UpdateProductDTO.update({ images: uploads, id, userId, ...req.body });
        if (error) return res.status(400).json({ error });

        new UpdateProduct(this.repository).execute(updateProductDTO!)
            .then(product => { res.status(200).json(product) })
            .catch(error => handleErrors(error, res));

        return

    }

    deleteProduct = (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.body.user.id;

        const [error, deleteProductDTO] = DeleteProductDTO.delete({ id, userId });
        if (error) return res.status(400).json({ error });
        new DeleteProduct(this.repository).execute(deleteProductDTO!)
            .then(product => { res.status(200).json(product) })
            .catch(error => handleErrors(error, res));

        return;
    }

    addWishlist = (req: Request, res: Response) => {

        const id = req.body.user.id;
        const { product } = req.body

        const [error, createWishlistDTO] = CreateWishlistDTO.create({ product, id });
        if (error) return res.status(400).json({ error });

        new AddWishlist(this.repository).execute(createWishlistDTO!)
            .then(wishlist => { res.status(201).json(wishlist) })
            .catch(error => handleErrors(error, res));

        return;
    }

    getProductByCategory = (req: Request, res: Response) => {

        const catId = req.body.catId;
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        new GetProductByCategory(this.repository).execute(catId, paginationDto!)
            .then(products => { res.status(200).json(products) })
            .catch(error => handleErrors(error, res));

        return;
    }

    getProductByBrand = (req: Request, res: Response) => {

        const brandId = req.body.brandId;
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });
        new GetProductByBrand(this.repository).execute(brandId, paginationDto!)
            .then(products => { res.status(200).json(products) })
            .catch(error => handleErrors(error, res));

        return;
    }

    uploadImage = (req: Request, res: Response) => {
        const type = req.params.type;
        console.log(type, 'que type tengo');
        const file = req.body.files.at(0) as UploadedFile;

        const [error, uploadImagesDTO] = UploadImagesDTO.upload({ file, folder: type });
        if (error) return res.status(400).json({ error });
        new UploadImage(this.repository).execute(uploadImagesDTO!)
            .then(upload => { res.status(200).json(upload) })
            .catch(error => handleErrors(error, res));

        return;
    }

    uploadImages = async (req: Request, res: Response) => {
        const type = req.params.type;
        const files = req.body.files as UploadedFile[];


        const uploads = await Promise.all(files.map(async file => {
            const [error, uploadImagesDTO] = UploadImagesDTO.upload({ file, folder: type });
            if (error) return res.status(400).json({ error });

            new UploadImage(this.repository).execute(uploadImagesDTO!)
                .then(upload => { return upload })
                .catch(error => handleErrors(error, res));

            return
        }));

        return res.status(200).json(uploads);

    }
}