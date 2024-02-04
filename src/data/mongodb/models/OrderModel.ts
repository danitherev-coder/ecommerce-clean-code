import { Schema, model } from 'mongoose';


const OrderSchema = new Schema({
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        title: String,
        picture_url: String,
        quantity: Number,
        unit_price: Number
    }],
    payment_intent: {},
    initPointURL: {
        type: String || null,
        default: null
    },
    order_status: {
        type: String,
        default: 'Not Processed'
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    orderBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    versionKey: false,
    toObject: { virtuals: true },
});

export const OrderModel = model('Order', OrderSchema);