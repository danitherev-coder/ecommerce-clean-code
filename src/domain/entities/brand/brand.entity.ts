import { CustomError } from "../../index";




export class BrandEntity {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly author: string,        
    ) { }


    static fromObject(object: {[key:string]:any}): BrandEntity {
        const { id, name, author } = object;

        if(!name) throw CustomError.badRequest('Name is required');
        if(!author) throw CustomError.badRequest('Author is required');        

        return new BrandEntity(id, name, author);
    }
}