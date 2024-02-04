import { Schema, model } from 'mongoose';


const CartSchema = new Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            name: String,
            images: String,
            count: Number,
            discountedPrice: Number,
            color: String,
            price: Number,
            coupon: { // New field
                type: Schema.Types.ObjectId,
                ref: "Coupon"
            }
        }
    ],
    cartTotal: Number,
    orderBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true,
    versionKey: false,
    toObject: {
        transform: (_, ret) => {
            ret.id = ret._id;
            delete ret._id;
        }
    },
});

export const CartModel = model('Cart', CartSchema);