import Category from '../category/category.model.js';

export const categorySeeder = async() =>{
    try{

        const category = await Category.findOne({name: "Default"});

        if(!category){
            await Category.create({
                name: "Default",
                description: "Categoria por defecto al eliminar"
            })
            console.log("Default category is created succefully")
        }else{
            console.log("Default category already created")
        }
        
    }catch (error){
        console.log(`Error at create default category : ${error}`);
    }
}