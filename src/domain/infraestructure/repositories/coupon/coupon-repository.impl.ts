import { CreateCouponDTO, CouponEntity, CouponRepository, CouponDatasource, ProductEntity, PaginationDto } from "../../../index";



export class CouponRepositoryImpl implements CouponRepository {

    constructor(
        private readonly datasource: CouponDatasource
    ) { }


    getCoupons(paginationDto: PaginationDto): Promise<{}> {
        return this.datasource.getCoupons(paginationDto);
    }
    getCoupon(couponCode: string): Promise<CouponEntity> {
        return this.datasource.getCoupon(couponCode);
    }

    createAndApplyCoupon(createCouponDTO: CreateCouponDTO): Promise<CouponEntity> {
        return this.datasource.createAndApplyCoupon(createCouponDTO);
    }

    createCoupon(createCouponDTO: CreateCouponDTO): Promise<CouponEntity> {
        return this.datasource.createCoupon(createCouponDTO);
    }
    applyCoupon(couponCode: string, productId: string): Promise<ProductEntity> {
        return this.datasource.applyCoupon(couponCode, productId);
    }

    desApplyCoupon(couponCode: string, productId: string): Promise<ProductEntity> {
        return this.datasource.desApplyCoupon(couponCode, productId);
    }

    deleteCoupon(couponCode: string, userId: string): Promise<void> {
        return this.datasource.deleteCoupon(couponCode, userId);
    }

    couponExpired(): Promise<void> {
        return this.datasource.couponExpired();
    }
}