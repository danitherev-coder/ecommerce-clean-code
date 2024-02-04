import { Request, Response } from "express";
import { BrandRepository, CreateBrandDto, PaginationDto, UpdateBrandDto, GetBrands, GetBrand, CreateBrand, UpdateBrand, DeleteBrand } from "../../domain";
import { handleErrors } from "../errorHandler/errorHandler";



export class BrandController {
    constructor(
        private readonly brandRepository: BrandRepository
    ) { }


    getAllBrands = (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        new GetBrands(this.brandRepository).execute(paginationDto!)
            .then(brands => res.status(200).json(brands))
            .catch(error => handleErrors(error, res));

        return true;
    }

    getBrandById = (req: Request, res: Response) => {
        const { id } = req.params;
        new GetBrand(this.brandRepository).execute(id)
            .then(brand => res.status(200).json(brand))
            .catch(error => handleErrors(error, res));

    }

    createBrand = (req: Request, res: Response) => {
        const author = req.body.user.id;
        const [error, createBrandDto] = CreateBrandDto.create({ author, ...req.body });
        if (error) return res.status(400).json({ error });        

        new CreateBrand(this.brandRepository).execute(createBrandDto!)
            .then(brand => res.status(201).json(brand))
            .catch(error => handleErrors(error, res));

        return true;
    }

    updateBrand = (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.body.user.id;
        const [error, updateBrandDto] = UpdateBrandDto.update({ id, userId, ...req.body });
        if (error) return res.status(400).json({ error });

        new UpdateBrand(this.brandRepository).execute(updateBrandDto!)
            .then(brand => res.status(200).json(brand))
            .catch(error => handleErrors(error, res));

        return true;

    }

    deleteBrand = (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.body.user.id;

        new DeleteBrand(this.brandRepository).execute(id, userId)
            .then(brand => res.status(200).json(brand))
            .catch(error => handleErrors(error, res));
    }
}