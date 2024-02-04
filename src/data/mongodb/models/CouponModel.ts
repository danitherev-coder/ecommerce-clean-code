import { Schema, model } from 'mongoose';


const CouponSchema = new Schema({
    code: { type: String, required: true, unique: true },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    discount: { type: Number, required: true, min: 0, max: 100 },
    expireAt: { type: Date, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
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


CouponSchema.pre('save', function (next) {
    this.code = this.code.toUpperCase();
    next();
});

CouponSchema.pre('findOneAndUpdate', function (next) {
    (this as any)._update.code = (this as any)._update.code.toUpperCase();
    next();
});

export const CouponModel = model('Coupon', CouponSchema);