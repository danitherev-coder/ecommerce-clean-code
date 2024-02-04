import { Request, Response } from "express";
import { CategoryRepository, CreateCategory, CreateCategoryDto, DeleteCategory, GetCategories, GetCategory, PaginationDto, UpdateCategory, UpdateCategoryDto,GetCategoriesHierarchy } from "../../domain";
import { handleErrors } from "../errorHandler/errorHandler";




export class CategoryController {

    constructor(
        private readonly repository: CategoryRepository
    ) { }


    createCategory = (req: Request, res: Response) => {
        const [error, createCategoryDto] = CreateCategoryDto.create({ author: req.body.user.id, ...req.body });
        if (error) return res.status(400).json({ error });
        new CreateCategory(this.repository).execute(createCategoryDto!)
            .then(category => { res.status(201).json(category) })
            .catch(error => handleErrors(error, res));

        return;
    }

    updateCategory = (req: Request, res: Response) => {
        const { id } = req.params;

        const [error, updateCategoryDto] = UpdateCategoryDto.update({ id, userId: req.body.user.id, ...req.body });
        if (error) return res.status(400).json({ error });

        new UpdateCategory(this.repository).execute(updateCategoryDto!)
            .then(category => { res.status(200).json(category) })
            .catch(error => handleErrors(error, res));

        return;
    }

    deleteCategory = (req: Request, res: Response) => {
        const { id } = req.params;

        new DeleteCategory(this.repository).execute(id, req.body.user.id)
            .then(category => { res.status(200).json(category) })
            .catch(error => handleErrors(error, res));
    }

    getAllCategories = (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;

        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        new GetCategories(this.repository).execute(paginationDto!)
            .then(categories => { res.status(200).json(categories) })
            .catch(error => handleErrors(error, res));

        return;
    }

    getCategoryById = (req: Request, res: Response) => {
        const { id } = req.params;

        new GetCategory(this.repository).execute(id)
            .then(category => { res.status(200).json(category) })
            .catch(error => handleErrors(error, res));
    }

    getCategoriesHierarchy = (req: Request, res: Response) => {
        const { catId } = req.body;

        new GetCategoriesHierarchy(this.repository).execute(catId)
            .then(categories => { res.status(200).json(categories) })
            .catch(error => handleErrors(error, res));
    }
}