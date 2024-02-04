import { AddressEntity, UserRepository } from "../../index";

export interface DeleteAddressUseCase {
    execute(id: string, userId: string, addressId: string): Promise<AddressEntity>;
}


export class DeleteAddress implements DeleteAddressUseCase {

    constructor(
        private readonly repository: UserRepository
    ) { }

    execute(id: string, userId: string, addressId: string): Promise<AddressEntity> {
        return this.repository.deleteAddress(id, userId, addressId);
    }
}