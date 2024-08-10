const mongoose = require("mongoose");
mongoose.set("strictQuery",false);
require("dotenv").config({path: "./.env"});
const app = require("./index");

const DB = process.env.DB_URI;
mongoose.connect(DB,{
    useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000
}).then((con) =>{
    console.log("DB connected successfully");
}).catch((e)=>{
    console.log(e);
})

const port = process.env.PORT || 8000;
app.listen(port , () =>{
    console.log(`listening on port ${port}...`);
})
