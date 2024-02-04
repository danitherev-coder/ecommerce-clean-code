import { AuthRepository } from "../../index";

export interface ForgotPasswordVerifyTokenUseCase {
    execute(token: string): Promise<string>;
}


export class ForgotPasswordVerifyToken implements ForgotPasswordVerifyTokenUseCase {

    constructor(
        private readonly repository: AuthRepository
    ) { }

    execute(token: string): Promise<string> {
        return this.repository.forgotPasswordVerifyToken(token);
    }
}