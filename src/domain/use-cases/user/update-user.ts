import { AuthEntity, UpdateUserDto, UserRepository } from "../../index";

export interface UpdateUserUseCase {
    execute(updateUserDto: UpdateUserDto): Promise<AuthEntity>;
}


export class UpdateUser implements UpdateUserUseCase {

    constructor(
        private readonly repository: UserRepository
    ) { }

    execute(updateUserDto: UpdateUserDto): Promise<AuthEntity> {
        return this.repository.updateUser(updateUserDto);
    }
}