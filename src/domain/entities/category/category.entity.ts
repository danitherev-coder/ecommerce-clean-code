import { CustomError } from "../../index";



export class CategoryEntity {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly parent?: string | null,
        public readonly author?: string
    ) { }

    static fromObject(object: { [key: string]: any }): CategoryEntity {
        const { id, _id, name, parent, author } = object;

        if (!name) throw CustomError.badRequest('Name Category is required');
        // if (parent && typeof parent !== 'string') {
        //     return ['Parent must be a string'];
        // }
        return new CategoryEntity(id || _id, name, parent, author);
    }
}