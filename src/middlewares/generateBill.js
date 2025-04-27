import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from "../product/product.model.js";
import User from "../user/user.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateBill = async (products, total, user) => {
    try {
        const userData = await User.findById(user);
        if (!userData) throw new Error("Usuario no encontrado");

        const productDetails = await Promise.all(products.map(async (code) => {
            const product = await Product.findOne({ code });
            return product ? { descripcion: product.name, cantidad: 1, precio: product.price } : null;
        }));

        const filteredProducts = productDetails.filter(p => p !== null);

        const doc = new PDFDocument();

        const formattedDate = new Date().toLocaleDateString("es-ES").replace(/\//g, '-');

        const filePath = path.join(__dirname, '../../public/docs/bills', `factura_${userData.name}_${formattedDate}.pdf`);

        const folderPath = path.dirname(filePath);

        console.log('Folder path:', folderPath);

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
            console.log(`Directorio creado: ${folderPath}`);
        }

        const writeStream = fs.createWriteStream(filePath);

        writeStream.on('error', (err) => {
            console.error('Error al escribir el archivo PDF:', err);
            throw err; 
        });

        doc.pipe(writeStream);

        doc.fontSize(18).text('Factura', { align: 'center', underline: true });

        doc.fontSize(14).text(`Cliente: ${userData.name} ${userData.surname}`, { align: 'left' });
        doc.text(`Fecha: ${formattedDate}`, { align: 'left' });

        doc.moveDown();

        const startY = doc.y

        doc.text('Descripción', 100, startY);  
        doc.text('Cantidad', 270, startY);     
        doc.text('Precio', 400, startY);       

        doc.moveDown();


        filteredProducts.forEach(p => {

            const startY = doc.y

            doc.text(p.descripcion, 100, startY);
            doc.text(p.cantidad.toString(), 300, startY);
            doc.text(`Q${p.precio}`, 405, startY);
            doc.moveDown();

        });

        doc.moveDown();

        doc.fontSize(16).text(`Total: Q${total}`, { align: 'right' });

        doc.end();

        console.log(`Factura guardada correctamente en: ${filePath}`);

    } catch (error) {
        console.error('Error generando la factura:', error.message);
    }
};