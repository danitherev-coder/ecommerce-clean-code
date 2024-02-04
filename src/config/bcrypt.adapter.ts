import bcrypt from 'bcryptjs';


export class BcryptAdapter {

    static hash(password: string): string {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        return hash;
    }

    static compare(password: string, hash: string): boolean {
        return bcrypt.compareSync(password, hash);
    }

}