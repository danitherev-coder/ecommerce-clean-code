import { BcryptAdapter, EmailAdapter, JwtAdapter, envs, validarEmail } from '../../../../config';
import { UserModel } from '../../../../data';
import { AuthDataSource, AuthEntity, CustomError, LoginDto, RegisterDto } from '../../../index';
import cron from 'node-cron';


export class AuthDataSourceImpl implements AuthDataSource {

    constructor(
        private readonly jwtAdapter: JwtAdapter,
        private readonly emailAdapter: EmailAdapter
    ) { }




    async register(registerDto: RegisterDto): Promise<AuthEntity> {
        try {
            const findUser = await UserModel.findOne({ email: registerDto.email });
            if (findUser) throw CustomError.badRequest('Email already exists');

            // Crear el usuario pero no lo guardes todavía
            const user = new UserModel(registerDto);
            user.password = BcryptAdapter.hash(user.password);

            // Intenta enviar el correo, SIEMPRE SE ENVIA EL CORREO, usar un servicio de terceros para ver EL TEMA DE CORREOS DE REBOTE.
            const tokenEmailValidate = await this.sendEmailInformation(user.email);
            if (!tokenEmailValidate) throw CustomError.internalServer('No se pudo enviar el correo de verificación');

            // Si el correo se envió con éxito, guarda el token y el usuario
            user.token = tokenEmailValidate;
            await user.save();

            const { password, ...authEntity } = AuthEntity.fromObject(user);

            return authEntity;
        } catch (error) {
            console.log(error, 'que error sale');
            throw error;
        }
    }

    async login(loginDto: LoginDto): Promise<{ user: AuthEntity, token: string }> {
        const findUser = await UserModel.findOne({ email: loginDto.email });
        if (!findUser) throw CustomError.badRequest('Email or Password is incorrect - email');

        if (!findUser.emailVerified) throw CustomError.badRequest('Email or Password is incorrect - email verify is false');

        const isMatchPass = BcryptAdapter.compare(loginDto.password, findUser.password);
        if (!isMatchPass) throw CustomError.badRequest('Email or Password is incorrect - password incorrect');

        const { password, ...authEntity } = AuthEntity.fromObject(findUser);

        const token = await this.jwtAdapter.generateToken({ id: findUser.id, email: findUser.email });

        return {
            user: authEntity,
            token
        };
    }

    async verifyEmail(token: string): Promise<AuthEntity> {

        const findUser = await UserModel.findOne({ token });
        if (!findUser) throw CustomError.badRequest('User not found');

        findUser.emailVerified = true;
        findUser.token = '';

        await findUser.save();

        const { password, ...authEntity } = AuthEntity.fromObject(findUser);

        return authEntity;
    }

    private sendEmailInformation = async (email: string): Promise<string> => {
        try {

            const token = await this.jwtAdapter.generateToken({ email });
            if (!token) throw CustomError.internalServer('Error to generate token');

            const link = `${envs.WEBSERVICE_URL}/auth/verify-email/${token}`;
            const html = `
            <h1>Verifica tu correo electronico</h1>
            <p>Para poder usar la aplicacion debes verificar tu correo electronico</p>
            <a href="${link}">Verificar:${link}</a>            
            `

            const options = {
                to: email,
                subject: 'Verifica tu correo electronico',
                htmlBody: html
            }

            const isSent = await this.emailAdapter.sendEmail(options);
            if (!isSent) throw CustomError.internalServer('Error sending email');

            return token;

        } catch (error) {
            throw error;
            return `${error}`
        }
    }

    async forgotPassword(email: string): Promise<string> {
        if (!email) throw CustomError.badRequest('Email is required');
        if (validarEmail.email.test(email) === false) throw CustomError.badRequest('Email is invalid');
        try {
            const user = await UserModel.findOne({ email });
            if (!user) throw CustomError.badRequest('User not found');

            user.token = await this.jwtAdapter.generateToken({ email });

            await user.save();

            const link = `${envs.WEBSERVICE_URL}/auth/forgot-password/${user.token}`;
            const html = `
            <h1>Restablecer Password</h1>
            <p>Para poder restablcer el password, haz click en el siguiente enlace.</p>
            <a href="${link}">Verificar:${link}</a>            
            `

            const options = {
                to: email,
                subject: 'Verifica tu correo electronico',
                htmlBody: html
            }

            const isSent = await this.emailAdapter.sendEmail(options);
            if (!isSent) throw CustomError.internalServer('Error sending email');

            return 'Email sent';

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async forgotPasswordVerifyToken(token: string): Promise<string> {
        if (!token) throw CustomError.badRequest('Token is required');

        try {
            const user = await UserModel.findOne({ token });
            if (!user) throw CustomError.badRequest('Token is invalid');

            return 'Token is valid';

        } catch (error) {
            throw error;
        }

    }

    async resetPassword(token: string, password: string): Promise<string> {
        if (!token) throw CustomError.badRequest('Token is required');
        if (!password) throw CustomError.badRequest('Password is required');

        const user = await UserModel.findOne({ token });
        if (!user) throw CustomError.badRequest('Token is invalid');

        user.password = BcryptAdapter.hash(password);
        user.token = '';

        await user.save();

        return 'Password changed';
    }

    //* Eliminar usuarios que no han verificado su correo en 24 horas
    // deleteUnverifiedUsers(): Promise<void> {
    //     // Ejecuta la tarea cada día a las 00:00
    //     cron.schedule('0 0 * * *', async () => {
    //         const cutoff = new Date();
    //         cutoff.setHours(cutoff.getHours() - 24); // Establece el límite en 24 horas atrás

    //         await UserModel.deleteMany({
    //             emailVerified: false,
    //             createdAt: { $lt: cutoff }
    //         });
    //     });
    //     return Promise.resolve();
    // }

    //* Eliminar usuarios que no han verificado su correo en 1 minuto
    // async deleteUnverifiedUsers(): Promise<void> {
    //     // Ejecuta la tarea cada minuto
    //     cron.schedule('* * * * *', async () => {
    //         const cutoff = new Date();
    //         cutoff.setMinutes(cutoff.getMinutes() - 1); // Establece el límite en 1 minuto atrás
    //         console.log('cutoff', cutoff);
    //         await UserModel.deleteMany({
    //             emailVerified: false,
    //             createdAt: { $lt: cutoff }
    //         });
    //     });
    //     return Promise.resolve();
    // }

    //* Eliminar usuarios que no han verificado su correo en 5 horas
    async deleteUnverifiedUsers(): Promise<void> {
        // Ejecuta la tarea cada 5 horas
        cron.schedule('0 */5 * * *', async () => {
            const cutoff = new Date();
            cutoff.setHours(cutoff.getHours() - 5); // Establece el límite en 5 horas atrás
            console.log('cutoff', cutoff);
            await UserModel.deleteMany({
                emailVerified: false,
                createdAt: { $lt: cutoff }
            });
        });
        return Promise.resolve();
    }
}