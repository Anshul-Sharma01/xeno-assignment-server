import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import sequelize from "./config/db.config.js";
import morgan from "morgan";

dotenv.config();


const app = express()
const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended : true }))
app.use(morgan("dev"));

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
