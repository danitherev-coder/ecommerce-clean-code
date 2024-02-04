import { AddAddresDTO, AddressEntity, UserRepository } from "../../index";

export interface AddAddressUseCase {
    execute(addAddressDTO: AddAddresDTO): Promise<AddressEntity>;
}


export class AddAddress implements AddAddressUseCase{
    
        constructor(
            private readonly repository: UserRepository
        ) { }
    
        execute(addAddressDTO: AddAddresDTO): Promise<AddressEntity> {
            return this.repository.addAdress(addAddressDTO);
        }
}