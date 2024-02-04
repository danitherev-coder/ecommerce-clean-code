import { RegisterDto, AuthEntity, LoginDto } from '../../index';



export abstract class AuthDataSource {

    constructor() { }

    abstract register(registerDto: RegisterDto): Promise<AuthEntity>;
    abstract login(loginDto: LoginDto): Promise<{ user: AuthEntity, token: string }>;
    abstract verifyEmail(token: string): Promise<AuthEntity>;
    abstract forgotPassword(email: string): Promise<string>;
    abstract forgotPasswordVerifyToken(token: string): Promise<string>;
    abstract resetPassword(token: string, password: string): Promise<string>;

    // Eliminar usuarios que no han verificado su correo en 24 horas
    abstract deleteUnverifiedUsers(): Promise<void>;
}