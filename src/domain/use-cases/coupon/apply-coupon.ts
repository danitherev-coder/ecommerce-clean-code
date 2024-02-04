import { CouponRepository, ProductEntity } from "../../index";


export interface ApplyCouponUseCase {
    execute(couponCode: string, productId: string): Promise<ProductEntity>
}

export class ApplyCoupon implements ApplyCouponUseCase {

    constructor(
        private readonly repository: CouponRepository
    ) { }

    execute(couponCode: string, productId: string): Promise<ProductEntity> {
        return this.repository.applyCoupon(couponCode, productId);
    }

}