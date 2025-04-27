import { hash , verify } from "argon2";
import User from "./user.model.js"
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

export const getUserById = async (req, res) => {
    try{
        const { uid } = req.params;
        const user = await User.findById(uid)

        if(!user){
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            })
        }

        return res.status(200).json({
            success: true,
            user
        })

    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error al obtener el usuario",
            error: err.message
        })
    }
}

export const getUsers = async (req, res) => {
    try{
        const { limite = 5, desde = 0 } = req.query
        const query = { status: true }

        const [total, users ] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        return res.status(200).json({
            success: true,
            total,
            users
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error al obtener los usuarios",
            error: err.message
        })
    }
}

export const listHistory = async (req,res) =>{
    try{
        const {uid} = req.params

        const user = await User.findById(uid).populate("history")

        return res.status(200).json({
            success: true,
            Hitstorial: user
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error al ver el historial",
            error: error.message
        }) 
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { uid } = req.params; 
        const { password, key } = req.body;

        if (uid !== key) {
            return res.status(400).json({
                success: false,
                message: 'No tienes permiso para eliminar este usuario',
            });
        }

        const user1 = await User.findById(uid);
        if (!user1) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        const requester = await User.findById(key);
        if (requester.role === "CLIENT_ROLE") {
            if (user1.role === "ADMIN_ROLE") {
                return res.status(400).json({
                    success: false,
                    message: 'Los clientes no pueden eliminar a administradores',
                });
            }
        }

        if (requester.role === "ADMIN_ROLE" && user1.role === "ADMIN_ROLE" && uid !== key) {
            return res.status(400).json({
                success: false,
                message: 'Los administradores no pueden eliminar a otros administradores',
            });
        }

        const oldPass = await verify(user1.password, password);

        if (!oldPass) {
            return res.status(400).json({
                success: false,
                message: "La contraseña no coincide",
            });
        }

        const user = await User.findByIdAndUpdate(uid, { status: false }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Usuario eliminado",
            user,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el usuario",
            error: err.message,
        });
    }
};


export const updatePassword = async (req, res) => {
    try{
        const { uid } = req.params
        const { newPassword } = req.body

        const user = await User.findById(uid)

        const matchOldAndNewPassword = await verify(user.password, newPassword)

        if(matchOldAndNewPassword){
            return res.status(400).json({
                success: false,
                message: "La nueva contraseña no puede ser igual a la anterior"
            })
        }

        const encryptedPassword = await hash(newPassword)

        await User.findByIdAndUpdate(uid, {password: encryptedPassword}, {new: true})

        return res.status(200).json({
            success: true,
            message: "Contraseña actualizada",
        })

    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error al actualizar contraseña",
            error: err.message
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const { key } = req.body;
        const data = req.body;

        if (uid !== key) {
            return res.status(400).json({
                success: false,
                msg: 'No tienes permiso para actualizar este perfil',
            });
        }

        const userToUpdate = await User.findById(key);

        if (!userToUpdate) {
            return res.status(404).json({
                success: false,
                msg: 'Usuario no encontrado',
            });
        }

        if (userToUpdate.role === "CLIENT_ROLE" && uid === key) {
            return res.status(400).json({
                success: false,
                msg: 'Los clientes no pueden actualizar los perfiles de administradores',
            });
        }

        if (userToUpdate.role === "ADMIN_ROLE" && uid !== key) {
            return res.status(400).json({
                success: false,
                msg: 'No se puede actualizar el perfil de un administrador',
            });
        }

        const user = await User.findByIdAndUpdate(uid, data, { new: true });

        return res.status(200).json({
            success: true,
            msg: 'Usuario actualizado',
            user,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: 'Error al actualizar usuario',
            error: err.message,
        });
    }
};


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const updateProfilePicture = async (req, res) => {
    try {
        const { uid } = req.params; 
        let newPicture = req.file ? req.file.filename : null; 

        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'Usuario no encontrado',
            });
        }

        if (user.profilePicture) {
            const oldPicturePath = path.join(__dirname,"../../public/uploads/profile_pictures", user.profilePicture);

            try {
                if (fs.existsSync(oldPicturePath)) {
                    fs.unlinkSync(oldPicturePath);
                }
            } catch (err) {
                console.error('Error al eliminar la foto anterior:', err);
            }
        }

        user.profilePicture = newPicture;
        await user.save();

        return res.status(200).json({
            success: true,
            msg: 'Foto de perfil actualizada',
            user,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: 'Error al actualizar la imagen de perfil',
            error: err.message,
        });
    }
};