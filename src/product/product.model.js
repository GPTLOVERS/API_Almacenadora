import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"]
    },
    stock: {
        type: Number,
        required: [true, "Stock is required"],
        default: 0
    },
    batch: [{
        type: Schema.ObjectId,
        ref: "Batch",
        default: []
    }],
    popularity: {
        type: Number,
        default: 0
    },
    category:{
        type: String,
        required: [true, "Category is required"]
    },
    receipts: [{
        type: String,
        default: []
    }],
    issues: [{
        type: Date,
        default: []
    }],
    history: [{
        type: Date,
        default: []
    }],
    status: {
        type: Boolean,
        default: true
    }
});

productSchema.methods.toJSON = function () {
    const { __v, status, _id, ...product } = this.toObject();
    product.uid = _id;
    return product;
};

export default model("Product", productSchema);
