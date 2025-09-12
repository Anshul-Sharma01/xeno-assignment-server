import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import sequelize from "./config/db.config.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";


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
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))


app.use(express.json());
app.use(express.urlencoded({ extended : true }))
app.use(morgan("dev"));
app.use(cookieParser());
app.set('trust proxy', 1);


app.use("/api/v1/ingestion", ingestionRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/tenant", tenantRouter);


const server = http.createServer(app);

const io = new Server(server, {
    cors : {
        origin : process.env.FRONTEND_URL,
        methods : ['GET', 'POST'],
        credentials : true
    }
})


io.on("connection", (socket) => {
    console.log(`Client connected : ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`Client disconnected : ${socket.id}`);
    });
})


const startServer = async() => {
    try{
        await sequelize.sync();
        console.log("Database Synced Successfully");

        const scheduler = new SyncSchedulerService(io);
        scheduler.start();

        server.listen(PORT, () => {
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