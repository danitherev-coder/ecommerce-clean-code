import { AddAddresDTO, AddressEntity, AuthEntity, CartEntity, UpdateAddresDTO, UpdateUserDto, UserEntity } from "../../index";



export abstract class UserRepository {
    constructor() { }

    abstract getAllUser(): Promise<{}>;
    abstract getUser(id: string): Promise<UserEntity>;
    abstract updateUser(updateUserDto: UpdateUserDto): Promise<AuthEntity>;
    abstract deleteUser(id: String, userId: string): Promise<string>;

    // agregar address al usuario
    abstract addAdress(addAddressDTO: AddAddresDTO): Promise<AddressEntity>;
    abstract updateAddress(updateAddresDTO: UpdateAddresDTO): Promise<AddressEntity>;
    abstract deleteAddress(id: string, userId: string, addressId: string): Promise<AddressEntity>;

    // obtener mi carrito de compras
    abstract getUserCart(userId: string, cartId: string): Promise<CartEntity>;
    abstract emptyCart(userId: string): Promise<CartEntity>;

}