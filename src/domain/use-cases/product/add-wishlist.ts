import { CreateWishlistDTO, ProductRepository, WishlistEntity } from "../../index";


export interface AddWishlistUseCase {
    execute(createWishlistDTO: CreateWishlistDTO): Promise<WishlistEntity[]>
}

export class AddWishlist implements AddWishlistUseCase {

    constructor(
        private readonly repository: ProductRepository
    ) { }

    execute(createWishlistDTO: CreateWishlistDTO): Promise<WishlistEntity[]> {
        return this.repository.addWishlist(createWishlistDTO);
    }
}
