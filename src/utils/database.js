'use strict';
require('dotenv').config();

const mongoose = require('mongoose');
const stringConnection =`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
mongoose.connect(stringConnection, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('database conected'))
    .catch(err => console.log(err));

