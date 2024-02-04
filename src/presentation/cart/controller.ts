import { Request, Response } from "express";
import { ApplyCouponToCart, CartRepository, CreateCart, CreateCartDto } from "../../domain";
import { handleErrors } from "../errorHandler/errorHandler";



export class CartController {
    constructor(
        private readonly repository: CartRepository
    ) { }


    createCart = (req: Request, res: Response) => {
        const orderBy = req.body.user.id;
        const [error, createCartDto] = CreateCartDto.create({ orderBy, ...req.body });
        if (error) return res.status(400).json({ error });

        new CreateCart(this.repository).execute(createCartDto!)
            .then(cart => { res.status(201).json({ cart }) })
            .catch(error => handleErrors(error, res));

        return;
    }

    applyCouponsToProducts = (req: Request, res: Response) => {
        const { cartId } = req.params;
        const userId = req.body.user.id;
        const productsCoupons = req.body.productsCoupons;
        new ApplyCouponToCart(this.repository).execute(cartId, userId, productsCoupons)
            .then(cart => { res.status(200).json({ cart }) })
            .catch(error => handleErrors(error, res));
    }
}