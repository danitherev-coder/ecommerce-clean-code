import { UserEntity, UserRepository } from "../../index";

export interface GetUserUseCase {
    execute(id: string): Promise<UserEntity>;
}


export class GetUser implements GetUserUseCase {

    constructor(
        private readonly repository: UserRepository
    ) { }

    execute(id: string): Promise<UserEntity> {
        return this.repository.getUser(id);
    }
}