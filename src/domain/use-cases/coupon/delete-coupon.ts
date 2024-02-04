import { CouponRepository } from "../../index";


export interface DeleteCouponUseCase {
    execute(couponCode: string, userId: string): Promise<void>
}

export class DeleteCoupon implements DeleteCouponUseCase {

    constructor(
        private readonly repository: CouponRepository
    ) { }

    execute(couponCode: string, userId: string): Promise<void> {
        return this.repository.deleteCoupon(couponCode, userId);
    }

}