


export class UploadImageEntity {

    constructor(
        public readonly url?: string | string[],
        
    ) { }

    static upload(object: { [key: string]: any }): UploadImageEntity {
        return new UploadImageEntity(object.url)
    }
}