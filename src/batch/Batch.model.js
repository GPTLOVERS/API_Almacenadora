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
    stockEntry:{
        type: Number,
        require: [true, "stockEntry is required"]
    },
    status:{
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timeStamps: true    
});

batchSchema.methods.toJSON = function(){
    const { __v, status, _id, ...batch} = this.toObject()
    batch.uid = _id
    return batch
    
};

export default model("Batch", batchSchema)

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2ODBmOGQ5YzcwODdhNWE2MWVjYmUwN2EiLCJpYXQiOjE3NDU4NDk3OTIsImV4cCI6MTc0NTg1MzM5Mn0.3EfIQxY_b0o7UOChMyJIZtBa2lA3uDl0tAzryk_TDYo