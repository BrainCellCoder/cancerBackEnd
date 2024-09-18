const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const familyRoutes = require('./routes/familyRoutes.js');
const memberRoutes = require('./routes/memberRoutes');
const esasRoutes = require('./routes/esasRoutes.js');

app.use(cors());
app.use(bodyParser.json({limit: "100mb"}));
app.use(
    bodyParser.urlencoded({
        limit: "100mb",
        extended: true,
        parameterLimit: 50000
    })
)

app.use((req,res,next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "POST, PUT, PATCH, DELETE, GET");
        return res.status(200).json();
    }
    next();
})

app.use('/api', familyRoutes);
app.use('/api', memberRoutes);
app.use('/api', esasRoutes);

module.exports = app;
