const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();


// connecting to DB
mongoose
  .set('strictQuery', true)
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DataBase Connected Successfully..."))
  .catch((err) => console.log(err));


// importing routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');


// using npm middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(cors()); //allows all origins
if (process.env.NODE_ENV = 'development') {  //allows only in development env
  app.use(cors({ origin: `http://localhost:3000` }));
}


// using route middlewares
app.use('/api', authRoutes);
app.use('/api', userRoutes);


// handling the ports
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});