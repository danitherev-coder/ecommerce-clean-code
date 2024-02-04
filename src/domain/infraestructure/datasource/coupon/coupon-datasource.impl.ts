import cron from 'node-cron';
import { CouponModel, ProductModel } from "../../../../data";
import { CouponDatasource, CreateCouponDTO, CouponEntity, CustomError, ProductEntity, PaginationDto } from "../../../index";
import mongoose from "mongoose";

interface Product {
    _id: string;
    price: number;
    discountedPrice: number;
    save: () => Promise<void>;
}

interface Coupon {
    _id: string;
    code: string;
    discount: number;
    products: string[];
    // incluye cualquier otro campo que necesites
}

export class CouponDatasourceImpl implements CouponDatasource {

    async getCoupons(paginationDto: PaginationDto): Promise<{}> {
        const { page = 1, limit = 10 } = paginationDto;

        const [totalCoupons, coupons] = await Promise.all([
            CouponModel.countDocuments(),
            CouponModel.find().skip((page - 1) * limit).limit(limit)
        ])

        // calcular el total de paginas que tendra la paginacion, si existen 5 paginas, si voy a la pagina 2, entonces mostrar que quedan 3 paginas, si voy a la pagina 3 mostrar que quedan 2 paginas
        const totalPages = Math.ceil(totalCoupons / limit);
        // calcular cuantas paginas quedan
        const remainingPages = totalPages - page;

        // Verifica si la pagina actual es mayor al total de paginas
        if (page > totalPages) {
            throw CustomError.badRequest('The page you are looking for does not exist');
        }

        return {
            page,
            limit,
            totalCoupons,
            totalPages,
            remainingPages,
            nextPage: (page + 1 <= totalPages) ? `/api/v1/coupons?page=${(page + 1)}&limit=${limit}` : null,
            previusPage: (page - 1 > 0) ? `/api/v1/coupons?page=${(page - 1)}&limit=${limit}` : null,
            coupons: coupons.map(coupon => CouponEntity.fromObject(coupon))
        }

    }

    async getCoupon(couponCode: string): Promise<CouponEntity> {
        const coupon = await CouponModel.findById(couponCode).populate('products')
        if (!coupon) throw CustomError.badRequest('Coupon not found');

        return CouponEntity.fromObject(coupon);
    }

    async createAndApplyCoupon(createCouponDTO: CreateCouponDTO): Promise<CouponEntity> {
        const coupon = await CouponModel.findOne({ code: createCouponDTO.code.toUpperCase() });
        if (coupon) throw CustomError.badRequest('Coupon already exists');

        // Convertir los IDs de productos a ObjectId antes de la comparación
        const productIds = Array.isArray(createCouponDTO.products)
            ? createCouponDTO.products.map(id => new mongoose.Types.ObjectId(id))
            : [new mongoose.Types.ObjectId(createCouponDTO.products)];

        // Verificar si alguno de los productos ya está en otro cupón
        const existingCoupon = await CouponModel.findOne({ products: { $in: productIds } }) as Coupon;

        console.log(existingCoupon, 'que cupon existe');

        if (existingCoupon) {
            const conflictingProductIds = existingCoupon.products.filter(productId => createCouponDTO.products.includes(new mongoose.Types.ObjectId(productId).toString()));

            console.log(conflictingProductIds, 'que ids en conflicto hay');

            if (conflictingProductIds.length > 0) {
                throw CustomError.badRequest(`Products with IDs ${conflictingProductIds.join(', ')} are already included in another coupon`);
            } else {
                throw CustomError.badRequest('One or more products are already included in another coupon');
            }
        }

        const newCoupon = new CouponModel(createCouponDTO);
        await newCoupon.save();

        // una vez creado el cupon, aplicar el descuento a todos los productos en discountedPrice
        const products = await ProductModel.find({ _id: { $in: createCouponDTO.products } }) as Product[];

        if (!products.length) throw CustomError.badRequest('No products found');

        for (let product of products) {
            const discountDecimal = createCouponDTO.discount / 100;
            product.discountedPrice = +((product.price - (product.price * discountDecimal)).toFixed(2));
            await product.save();
        }

        return CouponEntity.fromObject(newCoupon);
    }

    async createCoupon(createCouponDTO: CreateCouponDTO): Promise<CouponEntity> {
        const coupon = await CouponModel.findOne({ code: createCouponDTO.code.toUpperCase() });
        if (coupon) throw CustomError.badRequest('Coupon already exists');

        // Convertir los IDs de productos a ObjectId antes de la comparación
        const productIds = Array.isArray(createCouponDTO.products)
            ? createCouponDTO.products.map(id => new mongoose.Types.ObjectId(id))
            : [new mongoose.Types.ObjectId(createCouponDTO.products)];

        // Verificar si alguno de los productos ya está en otro cupón
        const existingCoupon = await CouponModel.findOne({ products: { $in: productIds } }) as Coupon;
        if (existingCoupon) {
            const conflictingProductIds = existingCoupon.products.filter(productId => createCouponDTO.products.includes(new mongoose.Types.ObjectId(productId).toString()));
            console.log(existingCoupon.products, 'que productos tiene el cupon');
            console.log(conflictingProductIds, 'que ids en conflicto hay');
            if (conflictingProductIds.length > 0) {
                throw CustomError.badRequest(`Products with IDs ${conflictingProductIds.join(', ')} are already included in another coupon`);
            } else {
                throw CustomError.badRequest('One or more products are already included in another coupon');
            }
        }

        const newCoupon = new CouponModel(createCouponDTO);
        await newCoupon.save();

        return CouponEntity.fromObject(newCoupon);
    }

    // El admin puede aplicar y desaplicar el cupón a un producto y en la base de datos el producto tendrá el precio con descuento o no.
    async applyCoupon(couponCode: string, productId: string): Promise<ProductEntity> {
        const coupon = await CouponModel.findOne({ code: couponCode.toUpperCase() }) as Coupon;
        if (!coupon) throw CustomError.badRequest('Invalid coupon code');

        const product = await ProductModel.findById(productId) as Product;
        if (!product) throw CustomError.badRequest('Product not found');

        // Verificar si el cupón es aplicable al producto
        if (!coupon.products.includes(productId)) throw CustomError.badRequest('Coupon not applicable to this product');

        // Aplicar el descuento del cupón al precio del producto
        const discountDecimal = coupon.discount / 100;
        product.discountedPrice = +((product.price - (product.price * discountDecimal)).toFixed(2));

        await product.save();

        return ProductEntity.fromObject(product);
    }

    async desApplyCoupon(couponCode: string, productId: string): Promise<ProductEntity> {
        const coupon = await CouponModel.findOne({ code: couponCode.toUpperCase() }) as Coupon;
        if (!coupon) throw CustomError.badRequest('Invalid coupon code');

        const product = await ProductModel.findById(productId) as Product;
        if (!product) throw CustomError.badRequest('Product not found');

        // Verificar si el cupón es aplicable al producto
        if (!coupon.products.includes(productId)) throw CustomError.badRequest('Coupon not applicable to this product');

        // Restablecer el precio con descuento del producto a 0
        product.discountedPrice = 0;

        await product.save();

        return ProductEntity.fromObject(product);
    }

    async deleteCoupon(couponCode: string, userId: string): Promise<void> {
        const coupon = await CouponModel.findById(couponCode);
        if (!coupon) throw CustomError.badRequest('Coupon not found');

        // Verificar si el usuario es el autor del cupón
        if (coupon.author!.toString() !== userId.toString()) throw CustomError.badRequest('You are not the author of this coupon');

        // Recorrer los productos que hay en CouponModel para poder eliminar el discountedPrice y dejarlo en 0
        for (let productId of coupon.products) {
            const product = await ProductModel.findById(productId);
            if (product) {
                product.discountedPrice = 0;
                await product.save();
            }
        }

        // Eliminar el cupón
        await CouponModel.deleteOne({ _id: coupon._id });
    }

    // Este coupon lo llamare desde el index.ts
    couponExpired(): Promise<void> {
        // Ejecuta la tarea todos los días a medianoche
        cron.schedule('0 0 * * *', async () => {
            const now = new Date();
            console.log(now, 'que hora es');
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            // Obtener todos los cupones que han expirado
            const expiredCoupons = await CouponModel.find({ expireAt: { $lt: now } }) as Coupon[];

            for (let coupon of expiredCoupons) {
                // Obtener todos los productos que tienen este cupón
                const products = await ProductModel.find({ _id: { $in: coupon.products } }) as Product[];

                // Restablecer el precio con descuento de cada producto a 0
                for (let product of products) {
                    product.discountedPrice = 0;
                    await product.save();
                }

                // Eliminar el cupón
                await CouponModel.deleteOne({ _id: coupon._id });
            }

            console.log('Current time:', now);
            console.log('Expired coupons:', expiredCoupons);
        });
        return Promise.resolve();
    }

}