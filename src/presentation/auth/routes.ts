import { Router } from "express";
import { AuthController } from "./controller";
import { AuthDataSourceImpl } from "../../domain/infraestructure/datasource/auth/auth-datasource.impl";
import { AuthRepositoryImpl } from "../../domain/infraestructure/repositories/auth/auth-repository.impl";
import { EmailAdapter, JwtAdapter, envs } from "../../config";
import { AuthMiddleware } from "../middlewares/verify-jwt";

// Puse TODO ESTO ACA AFUERA, porque sino no me funcionaba el cron, ya que necesitaba exportar el repository para usarlo en el index.ts, sino tendria que exportar todo esto en el index.ts y no me gustaba la idea
const jwt = new JwtAdapter(
    envs.JWT_SECRET,
);
const emailAdapter = new EmailAdapter(
    envs.MAILER_SERVICE,
    envs.MAILER_EMAIL,
    envs.MAILER_SECRET_KEY,
);
const datasource = new AuthDataSourceImpl(jwt, emailAdapter);
export const repository = new AuthRepositoryImpl(datasource);
const controller = new AuthController(repository);


console.log(AuthMiddleware);

export class AuthRoutes {
    static get routes() {

        const router = Router();


        router.post('/register', controller.register);
        router.post('/login', controller.login)
        router.get('/verify-email/:token', controller.verifyEmail);

        // olvide password
        router.post('/forgot-password', controller.forgotPassword);
        router.get('/forgot-password/:token', controller.forgotPasswordVerifyToken);
        router.post('/forgot-password/:token', controller.resetPassword);

        return router;
    }
}