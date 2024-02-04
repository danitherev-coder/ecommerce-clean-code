import { UploadedFile } from "express-fileupload";




export class UploadImagesDTO {
    constructor(
        public readonly file: UploadedFile, // esto es lo que nos da el paquete express-fileupload
        public readonly folder: string = 'uploads',
        public readonly validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif', 'webp'],
        public readonly name?: string
    ) { }

    static upload(object: { [key: string]: any }): [string?, UploadImagesDTO?] {
        return [undefined, new UploadImagesDTO(object.file, object.folder, object.validExtensions, object.name)]
    }

}