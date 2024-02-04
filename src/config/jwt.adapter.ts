import jwt from 'jsonwebtoken';


export class JwtAdapter {

    constructor(
        private readonly secret: string,
    ) { }

    generateToken = (payload: any, duration: string = '1d'): Promise<string> => {
        return new Promise((resolve) => {
            jwt.sign(payload, this.secret, { expiresIn: duration }, (err, token) => {
                if (err) resolve(err.message);
                resolve(token!);
            })
        })
    }

    validateToken<T>(token: string): Promise<T | null> {
        return new Promise((resolve) => {
            jwt.verify(token, this.secret, (error, decoded) => {
                if (error) {
                    resolve(null);
                }
                resolve(decoded as T);
            });
        });
    }
}