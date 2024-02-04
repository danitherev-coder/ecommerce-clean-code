import { Request, Response } from "express";
import { LoginDto, RegisterDto, AuthRepository } from '../../domain/index';
import { handleErrors } from "../errorHandler/errorHandler";





export class AuthController {
    constructor(
        private readonly repository: AuthRepository
    ) { }


    register = async (req: Request, res: Response) => {
        try {
            const [error, registerDto] = RegisterDto.create(req.body);
            if (error) return res.status(400).json({ error });

            const registerUser = await this.repository.register(registerDto!);

            return res.json(registerUser);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const [error, loginDto] = LoginDto.create(req.body);
            if (error) return res.status(400).json({ error });

            const loginUser = await this.repository.login(loginDto!);

            return res.json(loginUser);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    verifyEmail = async (req: Request, res: Response) => {
        try {
            const { token } = req.params;

            const verifyEmail = await this.repository.verifyEmail(token);

            return res.json(verifyEmail);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    forgotPassword = async (req: Request, res: Response) => {
        const { email } = req.body;
        try {
            await this.repository.forgotPassword(email);

            return res.json({ message: 'Se envio un mensaje a su correo' });

        } catch (error) {
            return handleErrors(error, res);
        }
    }

    forgotPasswordVerifyToken = async (req: Request, res: Response) => {
        const { token } = req.params;
        try {
            await this.repository.forgotPasswordVerifyToken(token);

            return res.json({ message: 'El token fue verificado con exito' });

        } catch (error) {
            return handleErrors(error, res);
        }
    }

    resetPassword = async (req: Request, res: Response) => {
        const { token } = req.params;
        const { password } = req.body;
        try {
            await this.repository.resetPassword(token, password);

            return res.json({ message: 'El password fue restablecido con exito' });
        } catch (error) {
            return handleErrors(error, res);
        }
    }


}