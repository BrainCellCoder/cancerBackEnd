require("dotenv").config({path: "./.env"});

const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER, 
    database: process.env.SQL_DATABASE,
    options: {
        encrypt: false, // Use true if you're connecting to Azure SQL, otherwise set to false
        trustServerCertificate: true, // Change to true for local dev / self-signed certs
    }
};

module.exports = config