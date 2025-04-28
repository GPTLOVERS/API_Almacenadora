import Employee from "./employee.model.js";


export const createEmployee = async (req, res) => {
    try {
        if (req.user.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                message: "Access denied. Only administrators can create employees."
            });
        }

        const data = req.body;
        const employee = await Employee.create(data);

        return res.status(201).json({
            message: "Employee has been created successfully",
            employee
        });
    } catch (error) {
        return res.status(500).json({
            message: "Employee creation failed",
            error: error.message
        });
    }
};


export const listEmployees = async (req, res) => {
    try {
        if (req.user.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                message: "Access denied. Only administrators can list employees."
            });
        }

        const { limite = 5, desde = 0 } = req.query;
        const query = { status: true };

        const [total, employees] = await Promise.all([
            Employee.countDocuments(query),
            Employee.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        return res.status(200).json({
            success: true,
            total,
            employees
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to list employees",
            error: error.message
        });
    }
};


export const updateEmployee = async (req, res) => {
    try {
        if (req.user.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                message: "Access denied. Only administrators can update employees."
            });
        }

        const data = req.body;
        const { uid } = req.params;

        const employee = await Employee.findByIdAndUpdate(uid, data, { new: true });

        return res.status(200).json({
            success: true,
            employee
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update employee",
            error: error.message
        });
    }
};


export const deleteEmployee = async (req, res) => {
    try {

        if (req.user.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                message: "Access denied. Only administrators can delete employees."
            });
        }

        const { uid } = req.params;

        await Employee.findByIdAndUpdate(uid, { status: false }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Employee deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete employee",
            error: error.message
        });
    }
};