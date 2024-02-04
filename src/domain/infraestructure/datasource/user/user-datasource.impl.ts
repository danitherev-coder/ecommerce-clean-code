import { BcryptAdapter } from "../../../../config";
import { CartModel, UserModel } from "../../../../data";
import { AddAddresDTO, AddressEntity, AuthEntity, CartEntity, CustomError, UpdateAddresDTO, UpdateUserDto, UserDataSource, UserEntity } from "../../../index";



export class UserDataSourceImpl implements UserDataSource {



    async getAllUser(): Promise<{}> {
        const users = await UserModel.find();

        return {
            users: users.map(user => AuthEntity.fromObject(user))
        }
    }

    async getUser(id: string): Promise<UserEntity> {
        try {
            const user = await UserModel.findById(id).populate('wishlist').exec();
            if (!user) throw CustomError.notFound('User not found');

            console.log(user, 'que me traiga');

            return UserEntity.fromObject(user);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getUserCart(userId: string, cartId: string): Promise<CartEntity> {

        const user = await UserModel.findById(userId);
        if (!user) throw CustomError.notFound('User not found');

        const existCart = await CartModel.findById(cartId);
        if (!existCart) throw CustomError.notFound('Cart not found');

        console.log(user.id, 'que me trae en user.id');

        const userCart = await CartModel.findOne({ orderBy: user.id }).populate('products').exec();
        if (!userCart) throw CustomError.notFound('No existe carrito de compras para este usuario');

        console.log(user, 'que me trae en user');
        console.log(existCart, 'que me trae en existCart');
        console.log(userCart, 'que me trae en userCart');

        return CartEntity.fromObject(userCart);
    }

    async emptyCart(userId: string): Promise<CartEntity> {
        const existUser = await UserModel.findById(userId);
        if (!existUser) throw CustomError.notFound('User not found');

        const cart = await CartModel.findOne({ orderBy: existUser.id });
        if (!cart) throw CustomError.notFound('Cart not found for this user');

        const emptyCart = await CartModel.findOneAndDelete({ orderBy: existUser.id });
        if (!emptyCart) throw CustomError.notFound('Cart not deleted');

        return CartEntity.fromObject(emptyCart);
    }

    async updateUser(updateUserDto: UpdateUserDto): Promise<AuthEntity> {
        const user = await UserModel.findById(updateUserDto.id);
        if (!user) throw CustomError.notFound('User not found');

        // si el ID del usuario no es igual, entonces no tiene derecho a actualizar
        if (user?.id?.toString() !== updateUserDto?.userId?.toString()) throw CustomError.badRequest('Solo puedes actualizar tu perfil');

        // si viene el password, entonces lo encriptamos
        let updateValues = updateUserDto.values;
        if (updateUserDto.password) {
            updateValues = { ...updateValues, password: BcryptAdapter.hash(updateUserDto.password) };
        }

        const updatedUser = await UserModel.findByIdAndUpdate(updateUserDto.id, updateValues, { new: true })

        console.log(updatedUser, 'que actualice');

        return AuthEntity.fromObject(updatedUser!);
    }

    async deleteUser(id: String, userId: string): Promise<string> {
        const user = await UserModel.findById(id);
        if (!user) throw CustomError.notFound('User not found');

        if (user?.id?.toString() !== userId.toString()) throw CustomError.badRequest('Solo puedes eliminar tu perfil');

        await UserModel.findByIdAndDelete(id);

        return 'User Eliminado'
    }

    async addAdress(addAddressDTO: AddAddresDTO): Promise<AddressEntity> {
        const user = await UserModel.findById(addAddressDTO.id);
        if (!user) throw CustomError.notFound('User not found');

        if (user?.id?.toString() !== addAddressDTO?.userId?.toString()) throw CustomError.badRequest('Solo puedes agregar direcciones a tu perfil');
        // Agrega la nueva dirección al array de direcciones del usuario
        user.address.push(addAddressDTO);

        // solo guardar 3 direcciones, si ya tiene 3, entonces mostrar mensaje de error
        if (user.address.length > 3) throw CustomError.badRequest('Solo puedes agregar 3 direcciones, elimina una para agregar otra, o actualiza una existente');

        // Guarda el usuario actualizado
        await user.save();

        const newAddress = user.address[user.address.length - 1];

        return AddressEntity.fromObject(newAddress);
    }

    async updateAddress(updateAddresDTO: UpdateAddresDTO): Promise<AddressEntity> {
        const user = await UserModel.findById(updateAddresDTO.id);
        if (!user) throw CustomError.notFound('User not found');

        if (user?.id?.toString() !== updateAddresDTO?.userId?.toString()) throw CustomError.badRequest('Solo puedes actualizar direcciones de tu perfil');

        // Busca la direccion a actualizar
        const addressToUpdate = user.address.find(address => address.id?.toString() === updateAddresDTO.addressId?.toString());
        // Si no existe la direccion, entonces mostrar mensaje de error
        if (!addressToUpdate) throw CustomError.notFound('Address not found');

        console.log(addressToUpdate, 'que es address to update');

        // Actualiza la direccion
        Object.assign(addressToUpdate, updateAddresDTO.values);
        console.log(updateAddresDTO.values, 'que es updateAddresDTO.values');
        // Guarda el usuario actualizado
        await user.save();

        const actualizado = user.address.find(address => address.id?.toString() === updateAddresDTO.addressId?.toString());

        console.log(actualizado, 'que actualice en impl');

        return AddressEntity.fromObject(actualizado!);
    }

    async deleteAddress(id: string, userId: string, addressId: string): Promise<AddressEntity> {
        const user = await UserModel.findById(id);
        if (!user) throw CustomError.notFound('User not found');

        if (user?.id?.toString() !== userId.toString()) throw CustomError.badRequest('Solo puedes eliminar direcciones de tu perfil');

        // Busca la direccion a eliminar
        const addressToDelete = user.address.id(addressId);

        // Si no existe la direccion, entonces mostrar mensaje de error
        if (!addressToDelete) throw CustomError.notFound('Address not found');

        // Elimina la direccion
        user.address.pull(addressId);

        // Guarda el usuario actualizado
        await user.save();

        return AddressEntity.fromObject(addressToDelete);
    }
}