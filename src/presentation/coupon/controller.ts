import { Request, Response } from "express";
import { ApplyCoupon, CouponRepository, CreateAndApplyCoupon, CreateCoupon, CreateCouponDTO, DeleteCoupon, DesApplyCoupon, GetCoupon, GetCoupons } from "../../domain";
import { handleErrors } from "../errorHandler/errorHandler";



export class CouponController {

    constructor(
        private readonly repository: CouponRepository
    ) { }


    getCoupons = (req: Request, res: Response) => {

        const { page = 1, limit = 10 } = req.query;
        const paginationDto = { page: Number(page), limit: Number(limit) };

        new GetCoupons(this.repository).execute(paginationDto)
            .then(categories => { res.status(200).json(categories) })
            .catch(error => handleErrors(error, res));

    }

    getCoupon = (req: Request, res: Response) => {
        const { couponCode } = req.params;
        new GetCoupon(this.repository).execute(couponCode)
            .then(coupon => { res.status(200).json(coupon) })
            .catch(error => handleErrors(error, res));
    }

    createAndApplyCoupon = (req: Request, res: Response) => {

        const { code, discount, expireAt, products } = req.body;
        const author = req.body.user.id;

        const [error, createCouponDto] = CreateCouponDTO.create({ author, code, discount, expireAt, products });
        if (error) return res.status(400).json({ error });

        new CreateAndApplyCoupon(this.repository).execute(createCouponDto!)
            .then(coupon => { res.status(201).json(coupon) })
            .catch(error => handleErrors(error, res));

        return;
    }

    applyCoupon = (req: Request, res: Response) => {
        const { couponCode, productId } = req.body;

        new ApplyCoupon(this.repository).execute(couponCode, productId)
            .then(product => { res.status(200).json(product) })
            .catch(error => handleErrors(error, res));

    }

    desApplyCoupon = (req: Request, res: Response) => {
        const { couponCode, productId } = req.body;
        new DesApplyCoupon(this.repository).execute(couponCode, productId)
            .then(product => { res.status(200).json(product) })
            .catch(error => handleErrors(error, res));
    }

    createCoupon = (req: Request, res: Response) => {

        const { code, discount, expireAt, products } = req.body;
        const author = req.body.user.id;

        const [error, createCouponDto] = CreateCouponDTO.create({ author, code, discount, expireAt, products });
        if (error) return res.status(400).json({ error });

        new CreateCoupon(this.repository).execute(createCouponDto!)
            .then(coupon => { res.status(201).json(coupon) })
            .catch(error => handleErrors(error, res));

        return
    }

    deleteCoupon = (req: Request, res: Response) => {
        const userId = req.body.user.id;
        const { couponCode } = req.body;
        new DeleteCoupon(this.repository).execute(couponCode, userId)
            .then(coupon => { res.status(200).json(coupon) })
            .catch(error => handleErrors(error, res));
    }

}