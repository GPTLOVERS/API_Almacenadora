import Proveedor from "./proveedores.model.js";

export const createProveedor = async (req, res) => {
    try {
        const data = req.body;

        const proveedor = new Proveedor(data);
        await proveedor.save();

        return res.status(201).json({
            success: true,
            message: "Proveedor creado exitosamente",
            proveedor,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al crear el proveedor",
            error: err.message,
        });
    }
};

export const getProveedores = async (req, res) => {
    try {
        const { limite = 5, desde = 0 } = req.query;
        const query = { status: true };

        const [total, proveedores] = await Promise.all([
            Proveedor.countDocuments(query),
            Proveedor.find(query)
                .skip(Number(desde))
                .limit(Number(limite)),
        ]);

        return res.status(200).json({
            success: true,
            total,
            proveedores,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los proveedores",
            error: err.message,
        });
    }
};

export const getProveedorById = async (req, res) => {
    try {
        const { id } = req.params;
        const proveedor = await Proveedor.findById(id);

        if (!proveedor) {
            return res.status(404).json({
                success: false,
                        message: "Proveedor no encontrado",
                    });
        }

        return res.status(200).json({
            success: true,
            proveedor,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener el proveedor",
            error: err.message,
        });
    }
};

export const updateProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const proveedor = await Proveedor.findByIdAndUpdate(id, data, { new: true });

        if (!proveedor) {
            return res.status(404).json({
                success: false,
                message: "Proveedor no encontrado",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Proveedor actualizado exitosamente",
            proveedor,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar el proveedor",
            error: err.message,
        });
    }
};

export const deleteProveedor = async (req, res) => {
    try {
        const { id } = req.params;

        const proveedor = await Proveedor.findByIdAndUpdate(id, { status: false }, { new: true });

        if (!proveedor) {
            return res.status(404).json({
                success: false,
                message: "Proveedor no encontrado",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Proveedor eliminado exitosamente",
            proveedor,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el proveedor",
            error: err.message,
        });
    }
};