import { CloudinaryAdapter } from '../../../../config/index';
import { CategoryModel, ProductModel } from '../../../../data';
import { CategoryDataSource, CategoryEntity, CreateCategoryDto, CustomError, PaginationDto, UpdateCategoryDto, } from '../../../index';
// import mongoose from 'mongoose';


export class CategoryDataSourceImpl implements CategoryDataSource {


    private cloudinaryAdapter = new CloudinaryAdapter();

    // categorias anidadas, categoria general, sub categorias, sub sub categorias
    async getCategoriesHierarchy(categoryId: string): Promise<{}> {
        try {
            console.log(categoryId, 'estoy pasando el id de la categoria?');
            // Paso 1: Buscar la categoría general
            const generalCategory = await CategoryModel.find({ parent: null });

            if (!generalCategory) {
                return {
                    Categories: []
                };  // La categoría general no fue encontrada
            }

            // Paso 2: Buscar las subcategorías con el parent igual al ID de la categoría general
            const categories = await Promise.all(generalCategory.map(async (cat) => {
                return {
                    id: cat._id,
                    name: cat.name,
                    subCategories: await this.getSubCategories(cat._id.toString())
                };
            }));

            return {
                Categories: categories
            };
        } catch (error) {
            // Manejo de errores
            console.error(error);
            throw error;
        }
    }

    // Función recursiva para obtener las subcategorías de una categoría
    async getSubCategories(parentId: string): Promise<{}> {
        const subCategories = await CategoryModel.find({ parent: parentId });

        return await Promise.all(subCategories.map(async (sub) => {
            return {
                id: sub._id,
                name: sub.name,
                subCategories: await this.getSubCategories(sub._id.toString())
            };
        }));
    }

    async getAllCategories(paginationDto: PaginationDto): Promise<{}> {
        const { page = 1, limit = 10 } = paginationDto;

        const [totalCategories, categories] = await Promise.all([
            CategoryModel.countDocuments({ parent: null }),  // Solo contar categorías generales
            CategoryModel.find({ parent: null })
                .populate({
                    path: 'parent',
                    select: 'id name parent',
                    populate: {
                        path: 'parent',
                        select: 'id name'
                    }
                })
                .populate('author', 'id firstname lastname')
        ]);

        const totalPages = Math.ceil(totalCategories / limit);
        const remainingPages = totalPages - page;

        if (page > totalPages) {
            throw CustomError.badRequest('The page you are looking for does not exist');
        }

        return {
            page,
            limit,
            totalCategories,
            totalPages,
            remainingPages,
            nextPage: (page + 1 <= totalPages) ? `/api/v1/categories?page=${(page + 1)}&limit=${limit}` : null,
            previusPage: (page - 1 > 0) ? `/api/v1/categories?page=${(page - 1)}&limit=${limit}` : null,
            categories: categories.map(category => CategoryEntity.fromObject(category))
        };
    }

    async getCategoryById(id: string): Promise<CategoryEntity> {
        const cat = await CategoryModel.findById(id)
            .populate({
                path: 'parent',
                select: 'id name parent',
                populate: {
                    path: 'parent',
                    select: 'id name'
                }
            })            
        if (!cat) throw CustomError.notFound('Category not found');

        return CategoryEntity.fromObject(cat);
    }

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
        const category = await CategoryModel.findOne({ name: createCategoryDto.name });
        if (category) throw CustomError.badRequest('Category already exists');

        if (createCategoryDto.parent) {
            await this.getCategoryById(createCategoryDto.parent);            
        }

        const newCategory = new CategoryModel(createCategoryDto);
        // const newCategory = new CategoryModel({
        //     ...createCategoryDto,
        //     parent: createCategoryDto.parent || null
        // });
        await newCategory.save();

        return CategoryEntity.fromObject(newCategory);
    }

    async updateCategory(updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
        const category = await this.getCategoryById(updateCategoryDto.id);
        // if (!category) throw CustomError.notFound('Category not found');

        if (updateCategoryDto.userId.toString() !== category.author!.toString()) throw CustomError.forbidden('You are not allowed to update this category');

        const updatedCategory = await CategoryModel.findByIdAndUpdate(updateCategoryDto.id, updateCategoryDto.values, { new: true });

        return CategoryEntity.fromObject(updatedCategory!);
    }


    async deleteCategory(id: string, userId: string): Promise<CategoryEntity> {
        const cat = await this.getCategoryById(id);

        if (cat.author!.toString() !== userId.toString()) throw CustomError.forbidden('You are not allowed to delete this category');

        await this.deleteCategoryAndChildren(cat.id.toString());
        await CategoryModel.findByIdAndDelete(id);

        return CategoryEntity.fromObject(cat);
    }

    async deleteCategoryAndChildren(id: string) {
        const products = await ProductModel.find({ category: id });

        // Elimina las imágenes de los productos en paralelo
        const deleteImagesPromises = products.map(product =>
            Promise.all((product.images as string[]).map(image => this.cloudinaryAdapter.delete(image)))
        );
        await Promise.all(deleteImagesPromises);

        // Elimina los productos y las categorías hijas en paralelo
        const deleteProductsPromise = ProductModel.deleteMany({ category: id });
        const childCategories = await CategoryModel.find({ parent: id });
        const deleteChildrenPromise = CategoryModel.deleteMany({ parent: id });
        await Promise.all([deleteProductsPromise, deleteChildrenPromise]);

        // Elimina las categorías hijas en paralelo
        const deleteGrandchildrenPromises = childCategories.map(child => this.deleteCategoryAndChildren(child.id));
        await Promise.all(deleteGrandchildrenPromises);
    }

}