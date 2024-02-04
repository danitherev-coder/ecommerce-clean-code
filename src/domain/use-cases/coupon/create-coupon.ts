import { CouponEntity, CouponRepository, CreateCouponDTO } from "../../index";


export interface CreateCouponUseCase {
    execute(createCouponDTO: CreateCouponDTO): Promise<CouponEntity>
}

export class CreateCoupon implements CreateCouponUseCase {

    constructor(
        private readonly repository: CouponRepository
    ) { }

    execute(createCouponDTO: CreateCouponDTO): Promise<CouponEntity> {
        return this.repository.createCoupon(createCouponDTO);
    }

}