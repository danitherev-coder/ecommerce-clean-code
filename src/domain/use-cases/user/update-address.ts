import { AddressEntity, UpdateAddresDTO, UserRepository } from "../../index";

export interface UpdateAddressUseCase {
    execute(updateAddresDTO: UpdateAddresDTO): Promise<AddressEntity>;
}


export class UpdateAddress implements UpdateAddressUseCase {

    constructor(
        private readonly repository: UserRepository
    ) { }

    execute(updateAddresDTO: UpdateAddresDTO): Promise<AddressEntity> {
        return this.repository.updateAddress(updateAddresDTO);
    }
}