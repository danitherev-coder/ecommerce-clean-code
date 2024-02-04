import { AuthEntity, AuthRepository } from "../../index";

export interface VerifyEmailUseCase {
    execute(token: string): Promise<AuthEntity>;
}


export class VerifyEmail implements VerifyEmailUseCase {

    constructor(
        private readonly repository: AuthRepository
    ) { }

    execute(token: string): Promise<AuthEntity> {
        return this.repository.verifyEmail(token);
    }
}