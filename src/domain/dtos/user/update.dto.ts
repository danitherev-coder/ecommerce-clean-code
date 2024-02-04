import { CustomError } from "../../errors/custom.error";




export class UpdateUserDto {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly firstname?: string,
        public readonly lastname?: string,
        public readonly email?: string,
        public readonly password?: string,
    ) { }


    get values() {
        const returnObject: { [key: string]: any } = {};


        if (this.firstname) returnObject.firstname = this.firstname;
        if (this.lastname) returnObject.lastname = this.lastname;
        if (this.email) returnObject.email = this.email;
        if (this.password) returnObject.password = this.password;
        if (this.userId) returnObject.userId = this.userId;

        return returnObject;
    }

    static create(object: { [key: string]: any }): [string?, UpdateUserDto?] {
        const { id, _id, userId, firstname, lastname, email, password } = object;

        if (!id && !_id) throw CustomError.badRequest('ID is required');
        if (firstname === '') throw CustomError.badRequest('firstname no debe estar vacio');
        if (lastname === '') throw CustomError.badRequest('Lastname no debe estar vacio');
        if (email === '') throw CustomError.badRequest('Email no debe estar vacio');
        if (password === '') throw CustomError.badRequest('Password no debe estar vacio');
        if (password?.length < 6) throw CustomError.badRequest('Password debe tener al menos 6 caracteres');

        if (!userId) throw CustomError.badRequest('userId is required');

        return [undefined, new UpdateUserDto(id || _id, userId, firstname, lastname, email, password)]
    }
}