import { Request, Response } from "express";
import { CouponRepository, CreateCouponDTO } from "../../domain";
import { handleErrors } from "../errorHandler/errorHandler";



export class CouponController {

    constructor(
        private readonly repository: CouponRepository
    ) { }


    getCoupons = async (req: Request, res: Response) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const paginationDto = { page: Number(page), limit: Number(limit) };

            const coupons = await this.repository.getCoupons(paginationDto);

            return res.status(200).json(coupons);

        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    getCoupon = async (req: Request, res: Response) => {
        try {
            const { couponCode } = req.params;

            const coupon = await this.repository.getCoupon(couponCode);

            return res.status(200).json(coupon);

        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    createAndApplyCoupon = async (req: Request, res: Response) => {
        try {
            const { code, discount, expireAt, products } = req.body;
            const author = req.body.user.id;

            const [error, createCouponDto] = CreateCouponDTO.create({ author, code, discount, expireAt, products });
            if (error) return res.status(400).json({ error });

            const coupon = await this.repository.createAndApplyCoupon(createCouponDto!);

            return res.status(201).json(coupon);

        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    applyCoupon = async (req: Request, res: Response) => {
        try {

            const { couponCode, productId } = req.body;

            const product = await this.repository.applyCoupon(couponCode, productId);

            return res.status(200).json(product);

        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    desApplyCoupon = async (req: Request, res: Response) => {
        try {

            const { couponCode, productId } = req.body;

            const product = await this.repository.desApplyCoupon(couponCode, productId);

            return res.status(200).json(product);

        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    createCoupon = async (req: Request, res: Response) => {
        try {
            const { code, discount, expireAt, products } = req.body;
            const author = req.body.user.id;

            const [error, createCouponDto] = CreateCouponDTO.create({ author, code, discount, expireAt, products });
            if (error) return res.status(400).json({ error });

            const coupon = await this.repository.createCoupon(createCouponDto!);

            return res.status(201).json(coupon);

        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }


    deleteCoupon = async (req: Request, res: Response) => {
        try {

            const userId = req.body.user.id;
            const { couponCode } = req.body;

            await this.repository.deleteCoupon(couponCode, userId);

            return res.status(200).json({ message: 'Coupon deleted' });

        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

}