import cloudinary from 'cloudinary';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import { envs } from './envs';

cloudinary.v2.config({
    cloud_name: envs.CLOUD_NAME,
    api_key: envs.API_KEY,
    api_secret: envs.API_SECRET,
    // secure: true
})


export class CloudinaryAdapter {
    private readonly cloudinary: any;

    constructor() {
        this.cloudinary = cloudinary.v2;
        this.cloudinary.config({
            cloud_name: envs.CLOUD_NAME,
            api_key: envs.API_KEY,
            api_secret: envs.API_SECRET,
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
        await this.cloudinary.uploader.destroy(public_ids);        
        // for (const public_id of public_ids) {
        //     const eliminando = await this.cloudinary.uploader.destroy(public_id);        
        // }
    }
}