import { validarEmail } from "../../../config";




export class RegisterDto {
    constructor(
        public readonly firstname: string,
        public readonly lastname: string,
        public readonly email: string,
        public readonly password: string,
    ) { }


    static create(object: { [key: string]: any }): [string?, RegisterDto?] {

        const { firstname, lastname, email, password } = object;

        if (!firstname) return ['Firstname name is required'];
        if (!lastname) return ['Lastname is required'];
        if (!email) return ['Email is required'];
        if (!validarEmail.email.test(email)) return ['Email is not valid'];
        if (!password) return ['Password is required'];
        if(password.length < 6 ) return ['Password must be at least 6 characters'];

        return [undefined, new RegisterDto(firstname, lastname, email, password)];
    }
}