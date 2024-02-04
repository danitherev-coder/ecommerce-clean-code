import { Request, Response } from "express";
import { CategoryRepository, CreateCategoryDto, PaginationDto, UpdateCategoryDto } from "../../domain";
import { handleErrors } from "../errorHandler/errorHandler";




export class CategoryController {

    constructor(
        private readonly repository: CategoryRepository
    ) { }


    createCategory = async (req: Request, res: Response) => {
        try {
            const [error, createCategoryDto] = CreateCategoryDto.create({ author: req.body.user.id, ...req.body });
            if (error) return res.status(400).json({ error });

            const category = await this.repository.createCategory(createCategoryDto!);

            return res.status(201).json(category);

        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    updateCategory = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const [error, updateCategoryDto] = UpdateCategoryDto.update({ id, userId: req.body.user.id, ...req.body });
            if (error) return res.status(400).json({ error });

            const category = await this.repository.updateCategory(updateCategoryDto!);

            return res.status(200).json(category);

        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    deleteCategory = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const category = await this.repository.deleteCategory(id, req.body.user.id);

            return res.status(200).json(category);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    getAllCategories = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;

        try {
            const [error, paginationDto] = PaginationDto.create(+page, +limit);
            if (error) return res.status(400).json({ error });

            const categories = await this.repository.getAllCategories(paginationDto!);
            return res.status(200).json(categories);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    getCategoryById = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const category = await this.repository.getCategoryById(id);

            return res.status(200).json(category);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    getCategoriesHierarchy = async (req: Request, res: Response) => {
        const { catId } = req.body;

        console.log(catId, 'catId');

        try {
            const categories = await this.repository.getCategoriesHierarchy(catId);

            return res.status(200).json(categories);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }
}