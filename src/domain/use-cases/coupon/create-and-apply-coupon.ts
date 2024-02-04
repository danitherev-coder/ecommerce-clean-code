import { CouponEntity, CouponRepository, CreateCouponDTO } from "../../index";


export interface CreateAndApplyCouponUseCase {
    execute(createCouponDTO: CreateCouponDTO): Promise<CouponEntity>
}

export class CreateAndApplyCoupon implements CreateAndApplyCouponUseCase {

    constructor(
        private readonly repository: CouponRepository
    ) { }

    execute(createCouponDTO: CreateCouponDTO): Promise<CouponEntity> {
        return this.repository.createAndApplyCoupon(createCouponDTO);
    }

}