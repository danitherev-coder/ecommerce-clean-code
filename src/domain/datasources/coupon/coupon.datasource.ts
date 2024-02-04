import { CouponEntity, CreateCouponDTO, PaginationDto, ProductEntity } from '../../index';




export abstract class CouponDatasource {

    abstract getCoupons(paginationDto: PaginationDto): Promise<{}>;
    abstract getCoupon(couponCode: string): Promise<CouponEntity>;
    abstract createAndApplyCoupon(createCouponDTO: CreateCouponDTO): Promise<CouponEntity>;
    abstract createCoupon(createCouponDTO: CreateCouponDTO): Promise<CouponEntity>;
    abstract applyCoupon(couponCode: string, productId: string): Promise<ProductEntity>;
    abstract desApplyCoupon(couponCode: string, productId: string): Promise<ProductEntity>;
    abstract deleteCoupon(couponCode: string, userId: string): Promise<void>;

    // esto es para eliminar el coupon cuando expira
    abstract couponExpired(): Promise<void>;
}