import { AuthRepository } from "../../index";

export interface ForgotPasswordUseCase {
    execute(email: string): Promise<string>;
}


export class ForgotPassword implements ForgotPasswordUseCase {

    constructor(
        private readonly repository: AuthRepository
    ) { }

    execute(email: string): Promise<string> {
        return this.repository.forgotPassword(email);
    }
}