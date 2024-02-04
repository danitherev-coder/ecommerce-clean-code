


export class CreateCategoryDto {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly parent?: string | null,
        public readonly author?: string,
    ) { }


    static create(object: { [key: string]: any }): [string?, CreateCategoryDto?] {

        const { id, _id, name, parent, author } = object;
        
        if (!name) return ['Name Category is required'];
        if (!author) return ['AuthorId is required'];
        if (parent !== undefined && typeof parent !== 'string') return ['Parent must be a string or null'];
        
        return [undefined, new CreateCategoryDto(id || _id, name, parent, author)];
    }

}