import { CustomError } from "../../index";

export class AddressEntity {
    constructor(
        public readonly id: string,
        public readonly address: string,
        public readonly city: string,
        public readonly state: string,
        public readonly country: string,
        public readonly zip: string,
        public readonly phone: string,
        public readonly isDefault: boolean = false,
        public readonly userId?: string
    ) { }

    static fromObject(object: { [key: string]: any }): AddressEntity {
        const { id, _id, address, city, state, country, zip, phone, isDefault = false, userId } = object;

        if (!address) throw CustomError.badRequest('Address is required');
        // if (!userId) throw CustomError.badRequest('UserId is required');
        // if (!city) throw CustomError.badRequest('City is required');
        // if (!state) throw CustomError.badRequest('State is required');
        // if (!country) throw CustomError.badRequest('Country is required');
        // if (!zip) throw CustomError.badRequest('Zip code is required');
        // if (!phone) throw CustomError.badRequest('Phone number is required');

        return new AddressEntity(id || _id, address, city, state, country, zip, phone, isDefault, userId);
    }
}