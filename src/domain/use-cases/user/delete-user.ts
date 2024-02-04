import { UserRepository } from "../../index";

export interface DeleteUserUseCase {
    execute(id: String, userId: string): Promise<string>;
}


export class DeleteUser implements DeleteUserUseCase {

    constructor(
        private readonly repository: UserRepository
    ) { }

    execute(id: String, userId: string): Promise<string> {
        return this.repository.deleteUser(id, userId);
    }
}