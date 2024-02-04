import { Schema, model } from 'mongoose'


const UserSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    img: {
        type: String,
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role'
    },
    cart: {
        type: Array,
        default: []
    },
    address: [
        {
            address: {
                type: String,
                trim: true,
            },
            city: {
                type: String,
                trim: true,
            },
            state: {
                type: String,
                trim: true,
            },
            country: {
                type: String,
                trim: true,
            },
            zip: {
                type: String,
                trim: true
            },
            phone: {
                type: String,
                trim: true
            },
            isDefault: {
                type: Boolean,
                default: false
            },
        }
    ],
    wishlist: [
        {
            type: Schema.Types.ObjectId,
            /// <reference path="product" />
            ref: 'Product'
        }
    ],
    isBlocked: {
        type: Boolean,
        default: false
    },
    token: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false,
});


// evitar regresar el password
UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.token;
    return user;
}

export const UserModel = model('User', UserSchema);