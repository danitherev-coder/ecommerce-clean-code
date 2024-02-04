import { Request, Response } from "express";
import { UserRepository, AddAddresDTO, UpdateAddresDTO, UpdateUserDto } from "../../domain";
import { handleErrors } from "../errorHandler/errorHandler";



export class UserController {
    constructor(
        private readonly repository: UserRepository
    ) { }

    getAllUser = async (req: Request, res: Response) => {
        const { xd } = req.query;
        console.log(xd);
        try {
            const users = await this.repository.getAllUser();
            return res.json(users);
        } catch (error) {
            return handleErrors(error, res);
        }
    }

    getUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const user = await this.repository.getUser(id);
            return res.json(user);
        } catch (error) {
            return handleErrors(error, res);
        }
    }

    getUserCart = async (req: Request, res: Response) => {
        const { cartId } = req.params;
        const userId = req.body.user.id;
        try {
            const user = await this.repository.getUserCart(userId, cartId);
            return res.json(user);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    emptyCart = async (req: Request, res: Response) => {
        const userId = req.body.user.id;
        try {
            const deleteCart = await this.repository.emptyCart(userId);
            return res.json(deleteCart);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    updateUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {

            const [error, updateUserDto] = UpdateUserDto.create({ ...req.body, userId: req.body.user.id, id });
            if (error) return res.status(400).json({ error });

            const user = await this.repository.updateUser(updateUserDto!);
            return res.json(user);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    deleteUser = async (req: Request, res: Response) => {

        const { id } = req.params;
        try {
            const deleteUser = await this.repository.deleteUser(id, req.body.user.id);
            return res.json(deleteUser);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    addAddress = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.body.user.id;
        try {
            const [error, addAddresDTO] = AddAddresDTO.create({ id, userId, ...req.body, });
            if (error) return res.status(400).json({ error });

            const address = await this.repository.addAdress(addAddresDTO!);

            return res.json(address);

        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    updateAddress = async (req: Request, res: Response) => {
        // Id del Usuario en la URL
        const { id } = req.params;
        // Id de la direccion en el body
        const { addressId } = req.body;
        // Id del usuario que inicio sesion
        const userId = req.body.user.id;
        try {
            const [error, updateAddresDTO] = UpdateAddresDTO.update({ id, userId, addressId, ...req.body });
            if (error) return res.status(400).json({ error });

            const address = await this.repository.updateAddress(updateAddresDTO!);

            return res.json(address);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    deleteAddress = async (req: Request, res: Response) => {
        // Id del Usuario en la URL
        const { id } = req.params;
        // Id de la direccion en el body
        const { addressId } = req.body;
        // Id del usuario que inicio sesion
        const userId = req.body.user.id;

        try {
            const address = await this.repository.deleteAddress(id, userId, addressId);
            return res.json(address);
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

}