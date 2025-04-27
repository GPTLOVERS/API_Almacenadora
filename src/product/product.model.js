    import { Schema , model } from "mongoose"

    const productSchema = new Schema({
        name:{
            type: String,
            required: [true, "Name is required"],
            unique: true
        },
        description:{
            type: String,
            required: [true, "Description is required"]
        },
        price:{
            type: Number,
            required: [true, "Price is required"]
        },
        stock:{
            type: Number,
            required: [true, "Stock is required"]
        },
        description:{
            type: String,
            required: [true, "Description is required"]
        },
        price:{
            type: Number,
            required: [true, "Price is required"]
        },
        stock:{
            type: Number,
            required: [true, "Stock is required"]
        },
        brand:{
            type: String,
            required: [true, "Brand is required"]
        },
        code:{
            type: Number
        },
        popularity:{
            type: Number,
            default: 0
        },
        status:{
            type: Boolean,
            default: true
        }

    });

    productSchema.methods.toJSON = function(){
        const { __v, status, _id, ...product } = this.toObject();
        product.uid = _id;
        return product;
    };


    export default model("Product", productSchema);
