import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import sequelize from "./config/db.config.js";
import morgan from "morgan";


// Router imports
import ingestionRouter from "./routes/ingestion.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js";

dotenv.config();


const app = express()
const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended : true }))
app.use(morgan("dev"));


app.use("/api/v1/ingestion", ingestionRouter);
app.use("/api/v1/dashboard", dashboardRouter);

const startServer = async() => {
    try{
        await sequelize.sync({ alter : true });
        console.log("Database Synced Successfully");

        app.listen(PORT, () => {
            console.log(`Server is listening on http://localhost:${PORT}`);
        })
    }catch(err){
        console.error(`Database connection error : ${err}`);
    }
}

startServer();
