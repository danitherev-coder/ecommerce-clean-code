import { CustomError } from "../../index";



export class AuthEntity {

    constructor(
        public readonly id: string,
        public readonly firstname: string,
        public readonly lastname: string,
        public readonly email: string,
        public readonly password?: string,
    ) { }


    static fromObject(object: { [key: string]: any }): AuthEntity {

        const { id, _id, firstname, lastname, email, password, } = object;

        
        if (!firstname) throw CustomError.badRequest('Missing firstname');
        if (!lastname) throw CustomError.badRequest('Missing lastName');
        if (!email) throw CustomError.badRequest('Missing email');
        if (!password) throw CustomError.badRequest('Missing password');
        if (password.length < 6) throw CustomError.badRequest('Password must be at least 6 characters');

        return new AuthEntity(id || _id, firstname, lastname, email);

    }

}