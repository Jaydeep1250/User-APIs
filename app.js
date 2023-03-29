const express = require('express');

const app = express();
const path = require('path');
const { User } = require('./models/models.service');
const route = require('./Routes/route');
// const authroute = require('./Routes/authroute');
const expressLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const upload = require('express-fileupload');
const dotenv = require('dotenv');


const mongoose = require('mongoose');
dotenv.config({ path: "./config.env" });
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));
app.use(upload());

app.use(express.json());
app.use(session({ resave: false, saveUninitialized: true, secret: 'nodedemo' }));
app.use(cookieParser());

app.set('layout', 'layout/layout');
app.use(expressLayouts);

app.use(express.static(__dirname + '/public'));

mongoose
    .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true
    })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// app.use('/', authroute);
app.use('/', route);

const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User API',
            version: '1.0.0',
        },
        servers: [{
            url: "http://localhost:7000",
        }, ],
    },
    apis: ["./Routes/*.js"],
};
const specs = swaggerJsDoc(swaggerOptions);


app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));


app.use((err, req, res, next) => {
    let error = {...err }
    if (error.name === 'JsonWebTokenError') {
        err.message = "please login again";
        err.statusCode = 401;
        return res.status(401).redirect('view/login');
    }
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'errors';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,

    })
});

const http = require("http").createServer(app);
http.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));