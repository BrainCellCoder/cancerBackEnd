// const mongoose = require("mongoose");
// mongoose.set("strictQuery",false);
 require("dotenv").config({path: "./.env"});
 const app = require("./index");

// const DB = process.env.DB_URI;
// mongoose.connect(DB).then((con) =>{
//     console.log("DB connected successfully");
// }).catch((e)=>{
//     console.log(e);
// })

// const port = process.env.PORT || 8000;
// app.listen(port , () =>{
//     console.log(`listening on port ${port}...`);
// })

const sql = require('mssql');
const config = require('./config');
async function connectToDatabase() {
    try {
        // Connect to the database
        await sql.connect(config);
        console.log('Connected to the database!');
    } catch (err) {
        console.error('Database connection failed:', err);
    } finally {
        // Close the connection
        // await sql.close();
    }
}



const port = process.env.PORT || 8000;
app.listen(port , () =>{
    console.log(`listening on port ${port}...`);
    connectToDatabase();
})
