import {Schema, model} from "mongoose";

const batchSchema = Schema({
    noBatch:{
        type: String,
        required: [true, "Number of the batch is required."],
        unique: true
    },
    type:{
        type: String,
        required: [true, "Type of the batch is required."],
        unique: true
    },
    product:{
        type: Schema.Types.ObjectId,
        ref: "Product",
        default: []
    },
    proveedor:{
        type: Schema.Types.ObjectId,
        ref: "Proveedor",
        default: []
    },
    dateOfEntry:{
        type: Date,
        required: [true, "Date of entry of the batch is required."]
    },
    status:{
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timeStamps: true    
});

loteSchema.methods.toJSON = function(){
    const { __v, status, _id, ...batch} = this.toObject()
    batch.uid = _id
    return batch
    
};

export default model("Lote", batchSchema)