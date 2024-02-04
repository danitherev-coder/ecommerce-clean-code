import { AddAddresDTO, AddressEntity, AuthEntity, CartEntity, UpdateAddresDTO, UpdateUserDto, UserDataSource, UserEntity, UserRepository } from "../../../index";



export class UserRepositoryImpl implements UserRepository {

    constructor(
        private readonly datasource: UserDataSource
    ) { }



    emptyCart(userId: string): Promise<CartEntity> {
        return this.datasource.emptyCart(userId);
    }

    getUserCart(userId: string, cartId: string): Promise<CartEntity> {
        return this.datasource.getUserCart(userId, cartId);
    }

    getAllUser(): Promise<{}> {
        return this.datasource.getAllUser();
    }
    getUser(id: string): Promise<UserEntity> {
        return this.datasource.getUser(id);
    }
    updateUser(updateUserDto: UpdateUserDto): Promise<AuthEntity> {
        return this.datasource.updateUser(updateUserDto);
    }
    deleteUser(id: String, userId: string): Promise<string> {
        return this.datasource.deleteUser(id, userId);
    }

    addAdress(addAddressDTO: AddAddresDTO): Promise<AddressEntity> {
        return this.datasource.addAdress(addAddressDTO);
    }

    updateAddress(updateAddresDTO: UpdateAddresDTO): Promise<AddressEntity> {
        return this.datasource.updateAddress(updateAddresDTO);
    }

    deleteAddress(id: string, userId: string, addressId: string): Promise<AddressEntity> {
        return this.datasource.deleteAddress(id, userId, addressId);
    }
}