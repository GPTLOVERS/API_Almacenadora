import Product from "../product/product.model.js"

export const registerProduct = async(req,res) =>{
    try{

        const data = req.body

        data.code = Math.floor(Math.random() * 9999) + 1111

        const product = await Product.create(data)

        return res.status(201).json({
            message: "Brand has been registred",
            product
        })
    }catch(error){
        return res.status(500).json({
            message: "Brand registration failed",
            error: error.message
        })
    }
}

export const listProduct = async(req,res) =>{
    try{
        const { limite = 5, desde = 0 } = req.query
                const query = { status: true }
        
                const [total, product ] = await Promise.all([
                    Product.countDocuments(query),
                    Product.find(query)
                        .skip(Number(desde))
                        .limit(Number(limite))
                ])
        
                return res.status(200).json({
                    success: true,
                    total,
                    product
                })
    }catch(error){
        return res.status(500).json({
            message: "List product failed",
            error: error.message
        })
    }
}

export const findProduct = async (req, res) => {
    try {
        const { name, desde = 0, limite = 10 } = req.query;
        const query = { status: true };

        if (name) {
            query.name = new RegExp(name, 'i');
        }

        const [total, product] = await Promise.all([
            Product.countDocuments(query), 
            Product.find(query)             
                .skip(Number(desde))        
                .limit(Number(limite))      
        ]);

        return res.status(200).json({
            success: true,
            total,
            product
        });
    } catch (error) {
        return res.status(500).json({
            message: "List product failed",
            error: error.message
        });
    }
};

export const popularityProduct = async (req, res) => {
    try {
        const products = await Product.find({}, { name: 1, popularity: 1, _id: 0 })                                     .sort({ popularity: -1 });

        return res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to list products",
            error: error.message
        });
    }
};


export const updateProduct = async(req,res) =>{
    try{

        const data = req.body
        const {uid} = req.params

        const product = await Product.findByIdAndUpdate(uid, data, {new: true})

        return res.status(200).json({
            success: true,
            product
        });

    }catch (error) {
        return res.status(500).json({
            message: "Update product failed",
            error: error.message
        });
    }
}

export const deleteProduct = async(req,res) =>{
    try{

        const {uid} = req.params

        await Product.findByIdAndUpdate(uid, {status: false}, {new: true})

        return res.status(200).json({
            success: true,
            message: "Product deleted"
        });

    }catch (error) {
        return res.status(500).json({
            message: "Update product failed",
            error: error.message
        });
    }
}




