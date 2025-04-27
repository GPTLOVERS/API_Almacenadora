import User from '../user/user.model.js';

export const userSeeder = async() =>{
    try{

        const user = await User.findOne({role: "ADMIN_ROLE"});

        if(!user){
            await User.create({
                name: "Admin",
                surname: "Admin",
                userName: "admin",
                email: "adminexample@gmail.com",
                password: "Admin123@",
                phone: "12345678",
                role: "ADMIN_ROLE"
            })
            console.log("Admin user is created succefully")
        }else{
            console.log("Admin user is already created")
        }
        
    }catch (error){
        console.log(`Error at create user : ${error}`);
    }
}