import { UploadImageEntity, ProductRepository, UploadImagesDTO } from "../../index";


export interface UploadImageUseCase {
    execute(uploadImagesDTO: UploadImagesDTO): Promise<UploadImageEntity>
}

export class UploadImage implements UploadImageUseCase {

    constructor(
        private readonly repository: ProductRepository
    ) { }

    execute(uploadImagesDTO: UploadImagesDTO): Promise<UploadImageEntity> {
        return this.repository.uploadImage(uploadImagesDTO);
    }
}
