import { CustomError } from "../../errors/custom.error";




export class CreateBrandDto {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly author: string,
    ) { }


    static create(object: { [key: string]: any }): [string?, CreateBrandDto?] {
        const { id, name, author } = object;

        if (!name) throw CustomError.badRequest('Name is required');
        if (!author) throw CustomError.badRequest('Author is required');

        return [undefined, new CreateBrandDto(id, name, author)];
    }
}