import { envs } from '../../config';
import { UserModel } from '../../data';
import { JwtAdapter } from './../../config/jwt.adapter';
import { NextFunction, Request, Response } from "express";




export class AuthMiddleware {

    constructor(        
        private jwtAdapter: JwtAdapter = new JwtAdapter(envs.JWT_SECRET),
    ) {
        this.validateJWT = this.validateJWT.bind(this);
     }

    async validateJWT(req: Request, res: Response, next: NextFunction) {
        const authorization = req.header('Authorization');
        if (!authorization) return res.status(401).json({ error: 'No Token Provider' });
        if (!authorization?.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid Brearer Token' })

        const token = authorization.split(' ')[1] || '';
        
        try {
            const payload = await this.jwtAdapter.validateToken<{ id: string }>(token);
            if (!payload) return res.status(401).json({ error: 'Invalid Token' });

            const user = await UserModel.findById(payload.id);
            if (!user) return res.status(401).json({ error: 'Invalid Token' });

            req.body.user = user;

            return next();

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

}