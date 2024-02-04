import { LoginDto, AuthEntity, AuthRepository } from "../../index";


export interface LoginUseCase {
    execute(dto: LoginDto): Promise<{ user: AuthEntity, token: string }>;
}


export class Login implements LoginUseCase {

    constructor(
        private readonly repository: AuthRepository
    ) { }

    execute(dto: LoginDto): Promise<{ user: AuthEntity, token: string }> {
        return this.repository.login(dto);
    }
}