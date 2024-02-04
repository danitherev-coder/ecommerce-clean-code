import { CloudinaryAdapter } from './../../../../config/index';
import { BrandModel, ProductModel } from "../../../../data";
import { BrandDataSource, BrandEntity, CreateBrandDto, CustomError, PaginationDto, UpdateBrandDto } from "../../../index";



export class BrandDataSourceImpl implements BrandDataSource {


    private CloudinaryAdapter = new CloudinaryAdapter();

    async getAllBrands(paginationDto: PaginationDto): Promise<{}> {
        const { page = 1, limit = 10 } = paginationDto;

        const [totalBrands, brands] = await Promise.all([
            BrandModel.countDocuments(),
            BrandModel.find()
                .skip((page - 1) * limit)
                .limit(limit)
        ]);

        // calcular el total de paginas que tendra la paginacion, si existen 5 paginas, si voy a la pagina 2, entonces mostrar que quedan 3 paginas, si voy a la pagina 3 mostrar que quedan 2 paginas
        const totalPages = Math.ceil(totalBrands / limit);
        // calcular cuantas paginas quedan
        const remainingPages = totalPages - page;

        // Verifica si la pagina actual es mayor al total de paginas
        if (page > totalPages) {
            throw CustomError.badRequest('The page you are looking for does not exist');
        }

        return {
            page,
            limit,
            totalBrands,
            totalPages,
            remainingPages,
            nextPage: (page + 1 <= totalPages) ? `/api/v1/brands?page=${(page + 1)}&limit=${limit}` : null,
            previusPage: (page - 1 > 0) ? `/api/v1/brands?page=${(page - 1)}&limit=${limit}` : null,
            brands: brands.map(brand => BrandEntity.fromObject(brand))
        }
    }

    async getBrandById(id: string): Promise<BrandEntity> {
        const brand = await BrandModel.findById(id);
        if (!brand) throw CustomError.notFound('Brand not found');

        return BrandEntity.fromObject(brand);
    }

    async createBrand(createBrandDto: CreateBrandDto): Promise<BrandEntity> {
        const brandName = createBrandDto.name.toUpperCase();
        const brand = await BrandModel.findOne({ name: brandName });
        if (brand) throw CustomError.badRequest('Brand already exists');

        const newBrand = new BrandModel(createBrandDto);
        await newBrand.save();

        return BrandEntity.fromObject(newBrand);
    }

    async updateBrand(updateBrandDto: UpdateBrandDto): Promise<BrandEntity> {
        const brand = await this.getBrandById(updateBrandDto.id);
        console.log(brand);
        // SI EL USERID NO ES IGUAL AL DEL AUTHOR, ENTONCES NO TIENE PERMISO PARA ACTUALIZAR
        if (brand.author.toString() != updateBrandDto.userId?.toString()) throw CustomError.unauthorized('You are not authorized to update this brand');

        // Verificar si el nombre ya existe en otro documento
        const brandName = updateBrandDto?.name!.toUpperCase();
        const existingBrand = await BrandModel.findOne({ name: brandName });
        if (existingBrand && existingBrand._id.toString() !== updateBrandDto.id) {
            throw CustomError.badRequest('Brand name already exists');
        }

        const updateBrand = await BrandModel.findByIdAndUpdate(updateBrandDto.id, updateBrandDto, { new: true });


        return BrandEntity.fromObject(updateBrand!);

    }

    async deleteBrand(id: string, userId: string): Promise<BrandEntity> {
        const brand = await this.getBrandById(id);


        // Si el userId no es igual al del author, entonces no tiene permiso para eliminar
        if (brand.author.toString() != userId.toString()) throw CustomError.unauthorized('You are not authorized to delete this brand');

        // Buscar todos los productos de la marca
        const products = await ProductModel.find({ brand: brand.id });

        // Iterar sobre los productos y eliminar sus imágenes
        for (const product of products) {
            // Eliminar las imágenes del producto
            await Promise.all((product.images as string[]).map(async (image) => {
                await this.CloudinaryAdapter.delete(image);
            }));
        }

        // Eliminar todos los productos de la marca
        await ProductModel.deleteMany({ brand: brand.id });


        const deletedBrand = await BrandModel.findByIdAndDelete(id);

        return BrandEntity.fromObject(deletedBrand!);
    }
}