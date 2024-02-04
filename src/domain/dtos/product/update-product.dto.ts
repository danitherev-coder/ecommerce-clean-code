



export class UpdateProductDTO {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly slug: string,
        public readonly description: string,
        public readonly price: number,
        public readonly category: string,
        public readonly brand: string,
        public readonly quantity: number,
        public readonly images: any[],
        public readonly color: string,
        public readonly userId: string
    ) { }

    get values() {
        const returnObject: { [key: string]: any } = {};
        
        if (this.title) returnObject.title = this.title;
        if (this.slug) returnObject.slug = this.slug;
        if (this.description) returnObject.description = this.description;
        if (this.price) returnObject.price = this.price;
        if (this.category) returnObject.category = this.category;
        if (this.brand) returnObject.brand = this.brand;
        if (this.quantity) returnObject.quantity = this.quantity;
        if (this.images) returnObject.images = this.images;
        if (this.color) returnObject.color = this.color;
        if (this.userId) returnObject.userId = this.userId;

        return returnObject;
    }

    static update(object: { [key: string]: any }): [string?, UpdateProductDTO?] {
        const { id, _id, title, slug, description, price, category, brand, quantity, images = [], color, userId } = object;

        if (!id && !_id) return ['Id is required'];


        return [undefined, new UpdateProductDTO(id || _id, title, slug, description, price, category, brand, quantity, images, color, userId)];
    }
}