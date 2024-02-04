import { Request, Response } from "express";
import { BrandRepository, CreateBrandDto, PaginationDto, UpdateBrandDto } from "../../domain";
import { handleErrors } from "../errorHandler/errorHandler";



export class BrandController {
    constructor(
        private readonly brandRepository: BrandRepository
    ) { }


    getAllBrands = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        try {
            const [error, paginationDto] = PaginationDto.create(+page, +limit);
            if (error) return res.status(400).json({ error });
            const brands = await this.brandRepository.getAllBrands(paginationDto!);
            return res.status(200).json(brands);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    getBrandById = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const brand = await this.brandRepository.getBrandById(id);
            return res.status(200).json(brand);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    createBrand = async (req: Request, res: Response) => {
        try {
            const author = req.body.user.id;
            const [error, createBrandDto] = CreateBrandDto.create({ author, ...req.body });
            if (error) return res.status(400).json({ error });

            const brand = await this.brandRepository.createBrand(createBrandDto!);
            return res.status(201).json(brand);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    updateBrand = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.body.user.id;
        try {
            const [error, updateBrandDto] = UpdateBrandDto.update({ id, userId, ...req.body });
            if (error) return res.status(400).json({ error });
            const brand = await this.brandRepository.updateBrand(updateBrandDto!);
            return res.status(200).json(brand);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    deleteBrand = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.body.user.id;
        try {
            const brand = await this.brandRepository.deleteBrand(id, userId);
            return res.status(200).json(brand);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }
}