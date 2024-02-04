import { CouponEntity, CreateCouponDTO, PaginationDto, ProductEntity } from '../../index';




export abstract class CouponRepository {

    abstract applyCoupon(couponCode: string, productId: string): Promise<ProductEntity>;
    abstract createAndApplyCoupon(createCouponDTO: CreateCouponDTO): Promise<CouponEntity>;
    abstract createCoupon(createCouponDTO: CreateCouponDTO): Promise<CouponEntity>;
    abstract deleteCoupon(couponCode: string, userId: string): Promise<void>;
    abstract desApplyCoupon(couponCode: string, productId: string): Promise<ProductEntity>;
    abstract getCoupon(couponCode: string): Promise<CouponEntity>;
    abstract getCoupons(paginationDto: PaginationDto): Promise<{}>;
    // esto es para eliminar el coupon cuando expira
    abstract couponExpired(): Promise<void>;
}