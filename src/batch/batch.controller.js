import Batch from "./Batch.model.js"
import Product from "../product/product.model.js"
import Proveedor from "../Proveedores/proveedores.model.js"

export const createBatch = async (req, res) =>{
    try{
        const data = req.body
        const batch = new Batch(data)

        await batch.save()
        await Product.findByIdAndUpdate(batch.product,{$inc: { stock: batch.stockEntry },$push: { receipts: batch.dateOfEntry , batch: batch._id}},{ new: true });        
        await Proveedor.findByIdAndUpdate(batch.proveedor,{$push:{products: batch.product}}, {new:true})

        return res.status(201).json({
            success: true,
            message: "Lote creado con exito.",
            batch
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Hubo un error al crear este lote.",
            error: error.message
        })
    }
}

export const listBatches = async (req, res) => {
    try{
        const { limite = 5, desde = 0} = req.query
            const query = { status: true}

            const [total, batch] = await Promise.all([
                Batch.countDocuments(query),
                Batch.find(query)
                    .skip(Number(desde))
                    .limit(Number(limite))
            ])

            return res.status(200).json({
                success: true,
                total,
                batch
            })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Hubo un error al obtener la lista de lotes.",
            error: error.message
        })
    }
}

export const updateBatch = async (req, res) => {
    try{
        const data = req.body
        const {uid} = req.params
        const batch = await Batch.findByIdAndUpdate(uid, data, {new: true})

        return res.status(200).json({
            success: true,
            message: "Exito al editar el lote.",
            batch
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Hubo un error al editar el lote.",
            error: error.message
        })
    }
}

export const deleteBatch = async (req, res) => {
    try{
        const {uid} = req.params
        await Batch.findByIdAndUpdate(uid, {status: false}, {new: true})

        return res.status(200).json({
            success: true,
            message: "Lote eliminado."
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Hubo un error al eliminar el producto.",
            error: error.message
        })
    }
}
export const getBatchById = async (req, res) => {
    try {
        const { uid } = req.params;
        const batch = await Batch.findById(uid);

        if (!batch) {
            return res.status(404).json({
                success: false,
                message: "Lote no encontrado",
            });
        }

        return res.status(200).json({
            success: true,
            batch,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener el lote",
            error: err.message,
        });
    }
};