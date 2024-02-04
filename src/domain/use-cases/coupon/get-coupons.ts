import { CouponRepository, PaginationDto } from "../../index";


export interface GetCouponsUseCase {
    execute(paginationDto: PaginationDto): Promise<{}>
}

export class GetCoupons implements GetCouponsUseCase {

    constructor(
        private readonly repository: CouponRepository
    ) { }

    execute(paginationDto: PaginationDto): Promise<{}> {
        return this.repository.getCoupons(paginationDto);
    }

}