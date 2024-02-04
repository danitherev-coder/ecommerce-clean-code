


export class DeleteProductDTO {
    constructor(
        public readonly id: string,
        public readonly userId: string
    ) { }


    static delete(object: { [key: string]: any }): [string?, DeleteProductDTO?] {

        const { id, _id, userId } = object;

        if (!id) return ['Id is required'];
        if (!userId) return ['UserId is required'];

        return [undefined, new DeleteProductDTO(id || _id, userId)];
    }
}