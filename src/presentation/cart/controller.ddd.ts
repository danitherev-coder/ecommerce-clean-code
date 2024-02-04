import { Request, Response } from "express";
import { CartRepository, CreateCartDto } from "../../domain";
import { handleErrors } from "../errorHandler/errorHandler";



export class CartController {
    constructor(
        private readonly repository: CartRepository
    ) { }


    createCart = async (req: Request, res: Response) => {

        const orderBy = req.body.user.id;

        try {
            const [error, createCartDto] = CreateCartDto.create({ orderBy, ...req.body });
            if (error) return res.status(400).json({ error });

            console.log(createCartDto, 'que obtengo en create cart dto desde mi body');

            const cart = await this.repository.createCart(createCartDto!);

            return res.status(201).json({ cart });

        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    applyCouponsToProducts = async (req: Request, res: Response) => {
        const { cartId } = req.params;
        const userId = req.body.user.id;
        const productsCoupons = req.body.productsCoupons;
        try {
            const cart = await this.repository.applyCouponToCart(cartId, productsCoupons, userId);

            return res.status(200).json({ cart });
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }
}