import { AuthRepository } from "../../index";

export interface ResetPasswordUseCase {
    execute(token: string, password: string): Promise<string>;
}


export class ResetPassword implements ResetPasswordUseCase {

    constructor(
        private readonly repository: AuthRepository
    ) { }

    execute(token: string, password: string): Promise<string> {
        return this.repository.resetPassword(token, password);
    }
}