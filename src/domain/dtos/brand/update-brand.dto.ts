import { CustomError } from "../../errors/custom.error";


export class UpdateBrandDto {
    constructor(
        public readonly id: string,
        public readonly name?: string,
        public readonly userId?: string
    ) { }

    get values() {
        const returnObject: { [key: string]: any } = {};
        if (this.name) returnObject.name = this.name;
        if (this.userId) returnObject.userId = this.userId;
        return returnObject;
    }

    static update(object: { [key: string]: any }): [string?, UpdateBrandDto?] {
        const { id, _id, name, userId } = object;

        if (!id && !_id) throw CustomError.badRequest('Id is required');
        if (name === '') throw CustomError.badRequest('Name not possible blank');
        return [undefined, new UpdateBrandDto(id || _id, name, userId)]
    }
}