import { Schema, model } from "mongoose";

const proveedorSchema = Schema({
    name: {
        type: String,
        required: [true, "Provider name is required"],
        maxLength: [50, "Name cannot exceed 50 characters"]
    },
    company: {
        type: String,
        required: [true, "Company name is required"],
        maxLength: [50, "Company name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 15,
        required: [true, "Phone number is required"]
    },
    address: {
        type: String,
        required: [true, "Address is required"],
        maxLength: [100, "Address cannot exceed 100 characters"]
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }],
    category:{
        type: String,
        default: "common"
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false, 
    timestamps: true 
});

proveedorSchema.methods.toJSON = function () {
    const { __v, status, _id, ...proveedor } = this.toObject();
    proveedor.uid = _id;
    return proveedor;
};

export default model("Proveedor", proveedorSchema);