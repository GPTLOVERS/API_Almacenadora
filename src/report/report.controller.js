import Product from "../product/product.model.js"
import ExcelJS from "exceljs"
import { ChartJSNodeCanvas } from "chartjs-node-canvas"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const width = 800;
const height = 400;
const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width,
    height,
    backgroundColour: "white"
});

export const generateInventoryReport = async (req, res) => {
    try {
        const products = await Product.find({}).select('name description price stock popularity receipts issues batch');

        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No hay productos disponibles en el inventario'
            });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Inventory Report');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Description', key: 'description', width: 40 },
            { header: 'Unit Price', key: 'price', width: 15, style: { numFmt: '"$"#,##0.00' } },
            { header: 'Stock', key: 'stock', width: 10 },
            { header: 'Total Value', key: 'totalValue', width: 15, style: { numFmt: '"$"#,##0.00' } },
            { header: 'Popularity', key: 'popularity', width: 15 },
            { header: 'Receipts', key: 'receipts', width: 30 },
            { header: 'Issues', key: 'issues', width: 30 },
            { header: 'Batch', key: 'batch', width: 30 }
        ];

        products.forEach(product => {
            const productValue = product.price * product.stock;

            worksheet.addRow({
                id: product._id.toString(),
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                totalValue: productValue,
                popularity: product.popularity || 0,
                receipts: (product.receipts || []).map(d => new Date(d).toISOString().split('T')[0]).join(', '),
                issues: (product.issues || []).map(d => new Date(d).toISOString().split('T')[0]).join(', '),
                batch: product.batch && product.batch.length > 0 ? product.batch.join(', ') : "Sin lote"
            });
        });

        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0];
        const fileName = `inventory_report_${formattedDate}.xlsx`;
        const filePath = path.join(__dirname, '../../public/docs/reports', fileName);

        await workbook.xlsx.writeFile(filePath);

        res.status(200).json({
            success: true,
            message: 'Reporte de inventario generado con éxito',
            data: {
                totalProducts: products.length,
                filePath: `/docs/reports/${fileName}`,
                url: "http://127.0.0.1:3005/salesManager/v1/report/getLatestInventoryReport"
            }
        });

    } catch (err) {
        return res.status(500).json({
            message: "Error al generar el reporte de inventario",
            error: err.message
        });
    }
};

export const generateInventoryMovementsReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;

        let start = startDate ? new Date(startDate) : null;
        let end = endDate ? new Date(endDate) : null;

        const products = await Product.find({ status: true }).select("name stock receipts issues batch");

        const filteredProducts = products.filter(product => {
            const hasReceipts = product.receipts.some(date => {
                const d = new Date(date);
                return (!start || d >= start) && (!end || d <= end);
            });

            const hasIssues = product.issues.some(date => {
                const d = new Date(date);
                return (!start || d >= start) && (!end || d <= end);
            });

            return hasReceipts || hasIssues;
        });

        if (filteredProducts.length === 0) {
            let msg = "No se realizaron movimientos";
            if (start && end) msg += ` entre ${startDate} y ${endDate}`;
            else if (start) msg += ` desde ${startDate}`;
            else if (end) msg += ` hasta ${endDate}`;

            return res.status(200).json({
                success: false,
                message: msg
            });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Inventory Movements Report');

        worksheet.columns = [
            { header: 'Producto', key: 'name', width: 30 },
            { header: 'Fechas de Entrada', key: 'receipts', width: 30 },
            { header: 'Fechas de Salida', key: 'issues', width: 30 },
            { header: 'Stock actual', key: 'stock', width: 15 },
            { header: 'Lotes', key: 'batch', width: 30 }
        ];

        const formatDate = d => new Date(d).toISOString().split('T')[0];

        filteredProducts.forEach(product => {
            const entriesInRange = product.receipts.filter(date => {
                const d = new Date(date);
                return (!start || d >= start) && (!end || d <= end);
            });

            const exitsInRange = product.issues.filter(date => {
                const d = new Date(date);
                return (!start || d >= start) && (!end || d <= end);
            });

            worksheet.addRow({
                name: product.name,
                receipts: entriesInRange.map(formatDate).join(', '),
                issues: exitsInRange.map(formatDate).join(', '),
                stock: product.stock,
                batch: product.batch.length > 0 ? product.batch.join(', ') : "Sin lote"
            });
        });

        const dateNow = new Date();
        const formattedDate = dateNow.toISOString().split('T')[0];
        const fileName = `inventory_movements_${formattedDate}.xlsx`;
        const filePath = path.join(__dirname, '../../public/docs/reports', fileName);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await workbook.xlsx.writeFile(filePath);

        res.status(200).json({
            success: true,
            message: "Inventory movements report generated successfully",
            data: {
                filePath: `/docs/reports/${fileName}`,
                url: "http://127.0.0.1:3005/salesManager/v1/report/getLatestMovementReport"
            }
        });

    } catch (err) {
        return res.status(500).json({
            message: "Error generating inventory movements report",
            error: err.message
        });
    }
};

export const generateAndSaveGraphImage = async (req, res) => {
    try {
        const { productosMasVendidos, actividadPorFecha } = req.body;

        if (!productosMasVendidos && !actividadPorFecha) {
            return res.status(400).json({
                success: false,
                message: "You must provide at least one option: productosMasVendidos or actividadPorFecha"
            });
        }

        const products = await Product.find({ status: true }).select("name stock receipts issues history popularity");

        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No products found'
            });
        }

        let configuration;
        let fileName;

        // Gráfico de productos más vendidos (popularidad)
        if (productosMasVendidos) {
            const productosVendidos = products.map(product => ({
                name: product.name,
                vendidos: product.popularity
            })).sort((a, b) => b.vendidos - a.vendidos).slice(0, 10);

            const labels = productosVendidos.map(p => p.name);
            const data = productosVendidos.map(p => p.vendidos);

            configuration = {
                type: 'bar',
                data: {
                    labels,
                    datasets: [{
                        label: 'Cantidad Vendida',
                        data,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        barPercentage: 0.4,
                        categoryPercentage: 0.7
                    }]
                },
                options: {
                    indexAxis: 'x',
                    responsive: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Productos Más Vendidos',
                            color: '#000',
                            font: {
                                size: 16
                            }
                        },
                        legend: {
                            labels: {
                                color: '#000'
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: '#000' }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: { color: '#000' }
                        }
                    }
                },
                plugins: [{
                    id: 'customBackgroundColor',
                    beforeDraw: (chart) => {
                        const ctx = chart.canvas.getContext('2d');
                        ctx.save();
                        ctx.fillStyle = 'white';
                        ctx.fillRect(0, 0, chart.width, chart.height);
                        ctx.restore();
                    }
                }]
            };

            fileName = "productos_mas_vendidos.png";
        }

        // Gráfico de actividad por producto: ingresos vs salidas
        if (actividadPorFecha) {
            const labels = products.map(p => p.name);

            const ingresos = products.map(product =>
                product.receipts ? product.receipts.length : 0
            );

            const salidas = products.map(product =>
                product.issues ? product.issues.length : 0
            );

            const popularidad = products.map(product => product.popularity || 0);


            configuration = {
                type: 'bar',
                data: {
                    labels,
                    datasets: [
                        {
                            label: 'Ingresos (Receipts)',
                            data: ingresos,
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                            barPercentage: 0.4,
                            categoryPercentage: 0.7
                        },
                        {
                            label: 'Salidas (Issues)',
                            data: salidas,
                            backgroundColor: 'rgba(255, 159, 64, 0.6)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 1,
                            barPercentage: 0.4,
                            categoryPercentage: 0.7
                        },
                        {
                            label: 'Popularidad (Popularity)',
                            data: popularidad,
                            backgroundColor: 'rgba(11, 204, 44, 0.6)',
                            borderColor: 'rgba(11, 204, 44, 0.6)',
                            borderWidth: 1,
                            barPercentage: 0.4,
                            categoryPercentage: 0.7
                        }
                    ]
                },
                options: {
                    indexAxis: 'x',
                    responsive: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Ingresos y Salidas por Producto',
                            color: '#000',
                            font: {
                                size: 16
                            }
                        },
                        legend: {
                            labels: {
                                color: '#000'
                            }
                        }
                    },
                    scales: {
                        x: {
                            stacked: false,
                            ticks: { color: '#000' }
                        },
                        y: {
                            beginAtZero: true,
                            stacked: false,
                            ticks: { color: '#000' }
                        }
                    }
                },
                plugins: [{
                    id: 'customBackgroundColor',
                    beforeDraw: (chart) => {
                        const ctx = chart.canvas.getContext('2d');
                        ctx.save();
                        ctx.fillStyle = 'white';
                        ctx.fillRect(0, 0, chart.width, chart.height);
                        ctx.restore();
                    }
                }]
            };

            fileName = "actividad_por_producto.png";
        }

        const imagePath = path.join(__dirname, "../../public/grafics", fileName);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
        fs.writeFileSync(imagePath, imageBuffer);

        res.status(200).json({
            success: true,
            message: "Gráfica generada y reemplazada correctamente",
            imageUrl: `/grafics/${fileName}`,
            imgsv: `http://localhost:3005/grafics/${fileName}`
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al generar la imagen de la gráfica",
            error: err.message
        });
    }
};

export const getLatestInventoryReport = (req, res) => {
    const dirPath = path.join(process.cwd(), 'public/docs/reports');
    fs.readdir(dirPath, (err, files) => {
        if (err || !files.length) {
            return res.status(404).json({ success: false, message: 'No hay reportes disponibles' });
        }

        const inventoryReports = files
            .filter(name => name.startsWith('inventory_report_') && name.endsWith('.xlsx'))
            .map(name => ({
                name,
                time: fs.statSync(path.join(dirPath, name)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time);

        if (!inventoryReports.length) {
            return res.status(404).json({ success: false, message: 'No hay reportes de inventario' });
        }

        const latest = inventoryReports[0].name;
        return res.redirect(`/docs/reports/${latest}`);
    });
};

export const getLatestMovementReport = (req, res) => {
    const dirPath = path.join(process.cwd(), 'public/docs/reports');
    fs.readdir(dirPath, (err, files) => {
        if (err || !files.length) {
            return res.status(404).json({ success: false, message: 'No hay reportes disponibles' });
        }

        const movementReports = files
            .filter(name => name.startsWith('inventory_movements_') && name.endsWith('.xlsx'))
            .map(name => ({
                name,
                time: fs.statSync(path.join(dirPath, name)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time);

        if (!movementReports.length) {
            return res.status(404).json({ success: false, message: 'No hay reportes de movimientos de inventario' });
        }

        const latest = movementReports[0].name;
        const filePath = path.join(dirPath, latest);
        return res.download(filePath);
    });
};