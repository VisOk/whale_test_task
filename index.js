// process.env.NODE_ENV = 'development';

const express = require("express");
const helmet = require('helmet');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
const routes = require("./routes/routes");

app.use(bodyParser.json());
app.use(cookieParser());
app.use("", routes);
app.use(helmet());

app.listen(80, ()=>{
    console.log("server started on port 80")
})