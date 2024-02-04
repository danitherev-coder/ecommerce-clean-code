import { Request, Response } from "express";
import { UserRepository, AddAddresDTO, UpdateAddresDTO, UpdateUserDto, GetUsers, GetUser, GetUserCart, EmptyCart, UpdateUser, DeleteUser, AddAddress, UpdateAddress, DeleteAddress } from "../../domain";
import { handleErrors } from "../errorHandler/errorHandler";



export class UserController {
    constructor(
        private readonly repository: UserRepository
    ) { }

    getAllUser = (req: Request, res: Response) => {
        const { xd } = req.query;
        console.log(xd);
        new GetUsers(this.repository).execute()
            .then(users => { res.status(200).json(users) })
            .catch(error => handleErrors(error, res));
        return;
    }

    getUser = (req: Request, res: Response) => {
        const { id } = req.params;

        new GetUser(this.repository).execute(id)
            .then(user => { res.status(200).json(user) })
            .catch(error => handleErrors(error, res));
    }

    getUserCart = (req: Request, res: Response) => {
        const { cartId } = req.params;
        const userId = req.body.user.id;
        new GetUserCart(this.repository).execute(cartId, userId)
            .then(cart => { res.status(200).json(cart) })
            .catch(error => handleErrors(error, res));
    }

    emptyCart = (req: Request, res: Response) => {
        const userId = req.body.user.id;
        new EmptyCart(this.repository).execute(userId)
            .then(cart => { res.status(200).json(cart) })
            .catch(error => handleErrors(error, res));
    }

    updateUser = (req: Request, res: Response) => {
        const { id } = req.params;

        const [error, updateUserDto] = UpdateUserDto.create({ ...req.body, userId: req.body.user.id, id });
        if (error) return res.status(400).json({ error });

        new UpdateUser(this.repository).execute(updateUserDto!)
            .then(user => { res.status(200).json(user) })
            .catch(error => handleErrors(error, res));

        return;
    }

    deleteUser = (req: Request, res: Response) => {

        const { id } = req.params;
        const userId = req.body.user.id;
        new DeleteUser(this.repository).execute(id, userId)
            .then(user => { res.status(200).json(user) })
            .catch(error => handleErrors(error, res));
    }

    addAddress = (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.body.user.id;

        const [error, addAddresDTO] = AddAddresDTO.create({ id, userId, ...req.body, });
        if (error) return res.status(400).json({ error });

        new AddAddress(this.repository).execute(addAddresDTO!)
            .then(address => { res.status(201).json(address) })
            .catch(error => handleErrors(error, res));

        return;
    }

    updateAddress = (req: Request, res: Response) => {
        // Id del Usuario en la URL
        const { id } = req.params;
        // Id de la direccion en el body
        const { addressId } = req.body;
        // Id del usuario que inicio sesion
        const userId = req.body.user.id;
        
            const [error, updateAddresDTO] = UpdateAddresDTO.update({ id, userId, addressId, ...req.body });
            if (error) return res.status(400).json({ error });
        new UpdateAddress(this.repository).execute(updateAddresDTO!)
            .then(address => { res.status(200).json(address) })
            .catch(error => handleErrors(error, res));

        return;
    }

    deleteAddress =  (req: Request, res: Response) => {
        // Id del Usuario en la URL
        const { id } = req.params;
        // Id de la direccion en el body
        const { addressId } = req.body;
        // Id del usuario que inicio sesion
        const userId = req.body.user.id;

        new DeleteAddress(this.repository).execute(id, userId, addressId)
            .then(address => { res.status(200).json(address) })
            .catch(error => handleErrors(error, res));
    }

}