import { Sequelize } from "sequelize";
import dotenv from "dotenv"
dotenv.config()

// For local development
// const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//         host : process.env.DB_HOST,
//         dialect : "mysql",
//         logging : false,
//     }
// )

// For render deployment
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect : "postgres",
    logging : false
})



try{
    await sequelize.authenticate();
    console.log("!! Database Connected Successfully !!")
}catch(err){
    console.error(`!! Unable to connect to db : ${err}`);
}

export default sequelize;

