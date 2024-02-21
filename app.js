//Starting of app.js file

const express = require('express');

const path = require('path');

const mongoose = require('mongoose');


const dotenv = require('dotenv');
dotenv.config();

//const sequelize = require('./util/database');

const User = require('./models/user');

const Expense = require('./models/expense');

const Order = require('./models/order');

const ForgetPassword = require('./models/forgotpassword');


const userRoutes = require('./routes/expense');

const signupRoute = require('./routes/user');

const loginRoute = require('./routes/login');

const perchaseRoute = require('./routes/purchase');

const premiumRoute = require('./routes/premiumFeature');

const forgotpasswordRoute = require('./routes/forgotpassword');



const port = process.env.PORT;

const app = express();


app.use(express.json());

app.use(express.static('public'))


app.use(signupRoute);

app.use(loginRoute);

app.use(userRoutes);

app.use(perchaseRoute);

app.use(premiumRoute);

app.use(forgotpasswordRoute);


//app.use(express.static(path.join(__dirname,'views')));


mongoose.connect(process.env.MONGODB_URL)
.then(result=>{
    app.listen(3000);
    console.log('connected!......');
})
.catch(err=>{
    console.log(err);
})
