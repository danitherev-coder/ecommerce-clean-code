



export class UpdateAddresDTO {
    constructor(
        public readonly id: string,
        public readonly addressId?: string,
        public readonly address?: string,
        public readonly city?: string,
        public readonly state?: string,
        public readonly country?: string,
        public readonly zip?: string,
        public readonly phone?: string,
        public readonly isDefault?: boolean,
        public readonly userId?: string,
    ) { }


    get values() {
        const returnObject: { [key: string]: any } = {};

        if (this.address) returnObject.address = this.address;
        // if (this.addressId) returnObject.addressId = this.addressId;
        if (this.city) returnObject.city = this.city;
        if (this.state) returnObject.state = this.state;
        if (this.country) returnObject.country = this.country;
        if (this.zip) returnObject.zip = this.zip;
        if (this.phone) returnObject.phone = this.phone;
        if (this.isDefault !== undefined) returnObject.isDefault = this.isDefault;
        // seguramente borrare esto
        // if (this.userId) returnObject.userId = this.userId;

        return returnObject;
    }


    static update(object: { [key: string]: any }): [string?, UpdateAddresDTO?] {

        const { id, _id, addressId, address, city, state, country, zip, phone, isDefault = false, userId } = object;

        if (!id && !_id) return ['ID for USER is required'];
        if (!addressId) return ['AddressId is required'];
        if (!userId) return ['UserId es el ID del usuario que inicio sesion y quiere crear su ADDRESS'];
        if (address === '') return ['address is required UPDATE DTO'];
        if (city === '') return ['city is required UPDATE DTO'];
        if (state === '') return ['state is required UPDATE DTO'];
        if (country === '') return ['country is required UPDATE DTO'];
        if (zip === '') return ['zip is required UPDATE DTO'];
        if (phone === '') return ['phone is required UPDATE DTO'];


        return [undefined, new UpdateAddresDTO(id || _id, addressId, address, city, state, country, zip, phone, isDefault, userId)];
    }
}