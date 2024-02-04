import { RegisterDto, AuthEntity, AuthRepository } from "../../index";


export interface RegisterUseCase {
    execute(dto: RegisterDto): Promise<AuthEntity>;
}


export class Register implements RegisterUseCase {

    constructor(
        private readonly repository: AuthRepository
    ) { }

    execute(dto: RegisterDto): Promise<AuthEntity> {
        return this.repository.register(dto);
    }
}