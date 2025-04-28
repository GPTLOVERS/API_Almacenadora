import User from "../user/user.model.js";
import Product from "../product/product.model.js";
import Proveedor from "../Proveedores/proveedores.model.js"; // Importa el modelo de Proveedores

export const emailExist = async (email = "") => {
    const exist = await User.findOne({ email });
    if (exist) {
        throw new Error(`The email ${email} is already registered`);
    }
};

export const userNameExist = async (userName = "") => {
    const exist = await User.findOne({ userName });
    if (exist) {
        throw new Error(`The userName ${userName} is already registered`);
    }
};

export const uidExist = async (uid = "") => {
    const exist = await User.findById(uid);
    if (!exist) {
        throw new Error("The provided ID does not exist");
    }
};

export const productExist = async (uid = "") => {
    const exist = await Product.findById(uid);
    if (!exist) {
        throw new Error("The provided product ID does not exist");
    }
};

// Nueva función para validar si un proveedor existe
export const proveedorExist = async (id = "") => {
    const exist = await Proveedor.findById(id);
    if (!exist) {
        throw new Error(`The provider with ID ${id} does not exist`);
    }
};