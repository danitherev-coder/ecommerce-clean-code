import { Schema, model } from 'mongoose';


const BrandSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true,
    versionKey: false,
    toObject: {
        transform: (doc: any, ret) => {
            console.log(doc);
            ret.id = ret._id;
            delete ret._id;
        }
    },
});

BrandSchema.pre('save', function (next) {
    this.name = this.name.toUpperCase();
    next();
});

BrandSchema.pre('findOneAndUpdate', function (next) {
    (this as any)._update.name = (this as any)._update.name.toUpperCase();
    next();
});

export const BrandModel = model('Brand', BrandSchema);