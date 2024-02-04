import { Request, Response } from "express";
import { LoginDto, AuthRepository, Register, RegisterDto, Login, VerifyEmail, ForgotPassword, ForgotPasswordVerifyToken, ResetPassword } from './../../domain/index';
import { handleErrors } from "../errorHandler/errorHandler";





export class AuthController {
    constructor(
        private readonly repository: AuthRepository
    ) { }


    register = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new Register(this.repository).execute(registerDto!)
            .then(register => res.json(register))
            .catch(error => handleErrors(error, res));

        return true;
    }

    login = (req: Request, res: Response) => {
        const [error, loginDto] = LoginDto.create(req.body);
        if (error) return res.status(400).json({ error });
        new Login(this.repository).execute(loginDto!)
            .then(login => res.json(login))
            .catch(error => handleErrors(error, res));
        return true;
    }

    verifyEmail = (req: Request, res: Response) => {
        const { token } = req.params;
        new VerifyEmail(this.repository).execute(token).catch(error => handleErrors(error, res));
    }

    forgotPassword = (req: Request, res: Response) => {
        const { email } = req.body;
        new ForgotPassword(this.repository).execute(email)
            .then(() => res.json({ message: 'El email fue enviado con exito' }))
            .catch(error => handleErrors(error, res));
    }

    forgotPasswordVerifyToken = (req: Request, res: Response) => {
        const { token } = req.params;
        new ForgotPasswordVerifyToken(this.repository).execute(token)
            .then(() => res.json({ message: 'El token fue verificado con exito' }))
            .catch(error => handleErrors(error, res));
    }

    resetPassword = (req: Request, res: Response) => {
        const { token } = req.params;
        const { password } = req.body;
        new ResetPassword(this.repository).execute(token, password)
            .then(() => res.json({ message: 'La contraseña fue actualizada con exito' }))
            .catch(error => handleErrors(error, res));
    }


}