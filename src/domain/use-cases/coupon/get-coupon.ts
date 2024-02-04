import { CouponRepository, CouponEntity } from "../../index";


export interface GetCouponUseCase {
    execute(couponCode: string): Promise<CouponEntity>
}

export class GetCoupon implements GetCouponUseCase {

    constructor(
        private readonly repository: CouponRepository
    ) { }

    execute(couponCode: string): Promise<CouponEntity> {
        return this.repository.getCoupon(couponCode);
    }

}