import { AuthRepository, AuthEntity, RegisterDto, LoginDto, AuthDataSource } from '../../../index';



export class AuthRepositoryImpl implements AuthRepository {

    constructor(
        private readonly datasource: AuthDataSource
    ) { }


    register(registerDto: RegisterDto): Promise<AuthEntity> {
        return this.datasource.register(registerDto);
    }
    login(loginDto: LoginDto): Promise<{ user: AuthEntity, token: string }> {
        return this.datasource.login(loginDto);
    }

    verifyEmail(token: string): Promise<AuthEntity> {
        return this.datasource.verifyEmail(token);
    }

    forgotPassword(email: string): Promise<string> {
        return this.datasource.forgotPassword(email);
    }

    forgotPasswordVerifyToken(token: string): Promise<string> {
        return this.datasource.forgotPasswordVerifyToken(token);
    }

    resetPassword(token: string, password: string): Promise<string> {
        return this.datasource.resetPassword(token, password);
    }

    // Eliminar usuarios que no han verificado su correo en 24 horas
    deleteUnverifiedUsers(): Promise<void> {
        return this.datasource.deleteUnverifiedUsers();
    }
}