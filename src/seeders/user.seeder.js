import User from '../user/user.model.js';
import { hash } from 'argon2'; 

export const userSeeder = async () => {
    try {
        const user = await User.findOne({ role: "ADMIN_ROLE" });

        if (!user) {
            const encryptedPass = await hash("Admin123@"); 

            await User.create({
                name: "Admin",
                surname: "Admin",
                userName: "admin",
                email: "adminexample@gmail.com",
                password: encryptedPass, 
                phone: "12345678",
                role: "ADMIN_ROLE"
            });
            console.log("Admin user is created successfully");
        } else {
            console.log("Admin user is already created");
        }
    } catch (error) {
        console.log(`Error at create user: ${error}`);
    }
}
