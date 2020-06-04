'use strict';

const mongoose = require('mongoose');
const stringConnection ='mongodb://localhost:27017/warehouse';

mongoose.connect(stringConnection, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('database conected'))
    .catch(err => console.log(err));

