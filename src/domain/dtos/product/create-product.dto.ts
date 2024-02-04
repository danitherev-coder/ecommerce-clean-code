



export class CreateProductDTO {
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
        // public readonly images: any[],
        public readonly color: string,
        public readonly author: string
    ) { }


    static create(object: { [key: string]: any }): [string?, CreateProductDTO?] {

        const { id, _id, title, slug, description, price, category, brand, quantity, images = [], color, author } = object;

        if (!title) return ['Title is required'];        
        if (!description) return ['Description is required'];
        if (!price) return ['Price is required'];
        if(isNaN(price)) return ['Price must be a number'];
        if (!category) return ['Category is required'];
        if (!brand) return ['Brand is required'];
        if (!quantity) return ['Quantity is required'];
        if(isNaN(quantity)) return ['Quantity must be a number'];
        if (!color) return ['Color is required'];
        if (!author) return ['author is required'];

        return [undefined, new CreateProductDTO(id || _id, title, slug, description, price, category, brand, quantity, images, color, author)];
    }

}