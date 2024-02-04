import { UserRepository } from "../../index";

export interface GetUsersUseCase {
    execute(): Promise<{}>;
}


export class GetUsers implements GetUsersUseCase {

    constructor(
        private readonly repository: UserRepository
    ) { }

    execute(): Promise<{}> {
        return this.repository.getAllUser();
    }
}