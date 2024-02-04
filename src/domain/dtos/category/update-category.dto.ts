

export class UpdateCategoryDto {
    constructor(
        public readonly id: string, // id de categoria
        public readonly userId: string, // id del usuario iniciado sesion
        public readonly name: string, // nombre de la categoria
        public readonly parent?: string | null, // id de la categoria padre        
    ) { }

    get values() {
        const returnObject: { [key: string]: any } = {};

        if (this.name) returnObject.name = this.name;
        if (this.userId) returnObject.categoryId = this.userId;
        if (this.parent) returnObject.parent = this.parent;

        return returnObject;
    }

    static update(object: { [key: string]: any }): [string?, UpdateCategoryDto?] {

        const { id, _id, userId, name, parent } = object;

        if (!id && !_id) return ['Debe enviar el ID de la categoria'];
        if (!userId) return ['UserId del usuario que inicio sesion'];
        if (name === '') return ['Name Category not blank'];
        if (parent !== undefined && typeof parent !== 'string') return ['Parent must be a string or null'];
        return [undefined, new UpdateCategoryDto(id || _id, userId, name, parent)];
    }

}