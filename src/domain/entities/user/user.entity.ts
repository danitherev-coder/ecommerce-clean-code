import { AddressEntity, AuthEntity, CartEntity, ProductEntity, WishlistEntity } from '../../index';

export class UserEntity extends AuthEntity {
    constructor(
        id: string,
        firstname: string,
        lastname: string,
        email: string,
        // password?: string,
        public readonly address?: AddressEntity,
        public readonly cart?: CartEntity,
        public readonly wishlist?: WishlistEntity[],
    ) {
        super(id, firstname, lastname, email);
    }

    // static fromObject(object: { [key: string]: any }): UserEntity {
    //     const { address, cart, wishlist, ...authObject } = object;
    //     const { id, firstname, lastname, email, password } = AuthEntity.fromObject(authObject._doc);

    //     const wishlistEntities = wishlist.map(WishlistEntity.fromObject.bind(WishlistEntity));

    //     return new UserEntity(id || id, firstname, lastname, email, password, address, cart, wishlistEntities);
    // }

    static fromObject(object: { [key: string]: any }): UserEntity {
        const { wishlist, id, firstname, lastname, email, address, cart } = object;
        const transformedWishlist = wishlist.map((item: any) => ProductEntity.fromObject(item));
        return new UserEntity(id, firstname, lastname, email, address, cart, transformedWishlist);
    }
}