import { CustomError } from "../../index";

export class ProductEntity {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly slug: string,
        public readonly description: string,
        public readonly price: number,
        public readonly discountedPrice: number,
        public readonly category: string,
        public readonly brand: string,
        public readonly quantity: number,
        public readonly sold: number,
        public readonly images: any[],
        public readonly color: string,
        public readonly ratings?: { star: number, comment: string, postedBy: string }[],
        public readonly totalrating?: string,
    ) { }

    static fromObject(object: { [key: string]: any }): ProductEntity {
        const { id, _id, title, slug, description, price, discountedPrice, category, brand, quantity, sold = 0, images = [], color, ratings = [], totalrating = "0" } = object;

        if (!title) throw CustomError.badRequest('Title is required');
        if (!slug) throw CustomError.badRequest('Slug is required - entity');
        if (!description) throw CustomError.badRequest('Description is required');
        if (!price) throw CustomError.badRequest('Price is required');
        if (!category) throw CustomError.badRequest('Category is required');
        if (!brand) throw CustomError.badRequest('Brand is required');
        if (!quantity) throw CustomError.badRequest('Quantity is required');
        if (!color) throw CustomError.badRequest('Color is required');

        return new ProductEntity(id || _id, title, slug, description, price, discountedPrice, category, brand, quantity, sold, images, color, ratings, totalrating);
    }
}