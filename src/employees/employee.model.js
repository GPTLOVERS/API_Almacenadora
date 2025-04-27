import { Schema, model } from "mongoose";

const employeeSchema = Schema({
    Name: {
        type: String,
        required: [true, "First name is required"],
        maxLength: [25, "First name cannot exceed 25 characters"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        maxLength: [25, "Last name cannot exceed 25 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    role: {
        type: String,
        required: true,
        enum: ["ADMIN_ROLE", "EMPLOYEE_ROLE"]
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
});

employeeSchema.methods.toJSON = function () {
    const { __v, _id, ...employee } = this.toObject();
    employee.uid = _id;
    return employee;
};

export default model("Employee", employeeSchema);