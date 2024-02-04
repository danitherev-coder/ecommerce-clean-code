import { CouponRepository, ProductEntity } from "../../index";


export interface DesApplyCouponUseCase {
    execute(couponCode: string, productId: string): Promise<ProductEntity>
}

export class DesApplyCoupon implements DesApplyCouponUseCase {

    constructor(
        private readonly repository: CouponRepository
    ) { }

    execute(couponCode: string, productId: string): Promise<ProductEntity> {
        return this.repository.desApplyCoupon(couponCode, productId);
    }

}