import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import sequelize from "./config/db.config.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";


// Router imports
import ingestionRouter from "./routes/ingestion.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js";
import tenantRouter from "./routes/tenant.routes.js";
import SyncSchedulerService from "./schedulers/sync.scheduler.js";

dotenv.config();


const app = express()
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))


app.use(express.json());
app.use(express.urlencoded({ extended : true }))
app.use(morgan("dev"));
app.use(cookieParser());


app.use("/api/v1/ingestion", ingestionRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/tenant", tenantRouter);

const startServer = async() => {
    try{
        await sequelize.sync();
        console.log("Database Synced Successfully");

        const scheduler = new SyncSchedulerService();
        scheduler.start();

        app.listen(PORT, () => {
            console.log(`Server is listening on http://localhost:${PORT}`);
        })
    }catch(err){
        console.error(`Database connection error : ${err}`);
    }
}

startServer();

app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({
        success: false,
        error: err.message || "Internal Server Error"
    });
});