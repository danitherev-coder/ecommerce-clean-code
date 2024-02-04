import { Schema, model } from 'mongoose'

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discountedPrice: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: "Brand"
    },
    quantity: {
        type: Number,
        required: true
    },
    sold: {
        type: Number,
        default: 0,
        select: false, // no queremos que se muestre en la respuesta
    },
    images: [{
        type: String
    }],
    color: [{
        type: String,
        required: true
    }],
    ratings: [{
        star: Number,
        comment: String,
        postedBy: { type: Schema.Types.ObjectId, ref: "User" }
    }],
    totalrating: {
        type: String,
        default: 0
    },
    author: {
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

export const ProductModel = model('Product', ProductSchema);