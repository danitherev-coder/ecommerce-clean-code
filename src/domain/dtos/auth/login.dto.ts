import { validarEmail } from "../../../config";
import { CustomError } from "../../errors/custom.error";




export class LoginDto {
    constructor(
        public readonly email: string,
        public readonly password: string,
    ) { }


    static create(object: { [key: string]: any }): [string?, LoginDto?] {

        const { email, password } = object;

        if (!email) throw CustomError.badRequest('Email is required');
        if (!validarEmail.email.test(email)) throw CustomError.badRequest('Email is not valid');
        if (!password) throw CustomError.badRequest('Password is required');

        return [undefined, new LoginDto(email, password)];

    }
}