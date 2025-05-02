'use strict';

import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { connectionDB } from "./mongo.js";
import authRoutes from "../src/Auth/auth.routes.js";
import userRoutes from "../src/user/user.routes.js";
import productRoutes from "../src/product/product.routes.js";
import proveedoresRoutes from "../src/Proveedores/proveedores.routes.js";
import batchRoutes from "../src/batch/batch.routes.js";
import reportRoutes from "../src/report/report.routes.js";
import { userSeeder } from "../src/seeders/user.seeder.js";
import { swaggerDocs, swaggerUi } from "./swagger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(helmet({
        crossOriginResourcePolicy: false
    }));
    app.use(cors({
        origin: true,
        credentials: true
    }));
    app.use(morgan("dev"));
};

const routes = (app) => {
    app.use("/salesManager/v1/auth", authRoutes);
    app.use("/salesManager/v1/user", userRoutes);
    app.use("/salesManager/v1/product", productRoutes);
    app.use("/salesManager/v1/proveedores", proveedoresRoutes);
    app.use("/salesManager/v1/batch", batchRoutes);
    app.use("/salesManager/v1/report", reportRoutes);
    app.use("/docs/reports/", express.static(path.join(process.cwd(), "public", "docs", "reports")));
    app.use('/grafics', express.static(path.join(__dirname, '../public/grafics')));
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

const connectionMongo = async () => {
    try {
        await connectionDB();
    } catch (error) {
        console.log(`Data Base connection failed: ${error}`);
    }
};

export const initServer = () => {
    const app = express();
    const timeInit = Date.now();
    try {
        middlewares(app);
        connectionMongo();
        routes(app);
        app.listen(process.env.PORT);
        userSeeder();
        const elapsedTime = Date.now() - timeInit;
        console.log(`Server running on port ${process.env.PORT} (${elapsedTime}ms)`);
    } catch (error) {
        console.log(`Server failed to start: ${error}`);
    }
};