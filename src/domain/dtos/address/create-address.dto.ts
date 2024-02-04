



export class AddAddresDTO {
    constructor(
        public readonly id: string,
        public readonly address: string,
        public readonly city: string,
        public readonly state: string,
        public readonly country: string,
        public readonly zip: string,
        public readonly phone: string,
        public readonly isDefault: boolean = false,
        public readonly userId?: string,
    ) { }


    static create(object: { [key: string]: any }): [string?, AddAddresDTO?] {

        const { id, _id, address, city, state, country, zip, phone, isDefault = false, userId } = object;

        if (!id && !_id) return ['Debe enviar el ID del usuario que quiere crear su ADDRESS'];
        if (!userId) return ['UserId es el ID del usuario que inicio sesion y quiere crear su ADDRESS'];
        if (!address) return ['address is required'];
        if (!city) return ['city is required DTO'];
        if (!state) return ['state is required DTO'];
        if (!country) return ['country is required DTO'];
        if (!zip) return ['zip is required DTO'];
        if (!phone) return ['phone is required DTO'];


        return [undefined, new AddAddresDTO(id || _id, address, city, state, country, zip, phone, isDefault, userId)];
    }
}