import { Schema, model } from 'mongoose';

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
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

export const CategoryModel = model('Category', CategorySchema);