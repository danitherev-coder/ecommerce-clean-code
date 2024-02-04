import cloudinary from 'cloudinary';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs';

cloudinary.v2.config({
    cloud_name: 'dpyr2wyaf',
    api_key: '846634682136411',
    api_secret: 'q3mJGEPShDL5r92iI5C_hCoEh6I',
    // secure: true
})


export class CloudinaryAdapter {
    private readonly cloudinary: any;

    constructor() {
        this.cloudinary = cloudinary.v2;
        this.cloudinary.config({
            cloud_name: 'dpyr2wyaf',
            api_key: '846634682136411',
            api_secret: 'q3mJGEPShDL5r92iI5C_hCoEh6I',
            // secure: true
        });
    }

    upload = async (files: UploadedFile[], type: String) => {
        const urls: string[] = [];

        for (const file of files) {
            const { tempFilePath } = file;
            const folder = `ecommerce/${type}`
            const { public_id } = await this.cloudinary.uploader.upload(tempFilePath, { folder });

            urls.push(public_id);
            fs.unlinkSync(tempFilePath);
        }

        return urls;
    }

    delete = async (public_ids: string) => {
        console.log(public_ids, 'estoy pasando los ids?');
        const eliminar = await this.cloudinary.uploader.destroy(public_ids);
        console.log(eliminar, 'estoy eliminando algo en mi funcion?');
        // for (const public_id of public_ids) {
        //     const eliminando = await this.cloudinary.uploader.destroy(public_id);
        //     console.log(eliminando, 'estoy eliminando algo en mi funcion?');
        // }
    }
}