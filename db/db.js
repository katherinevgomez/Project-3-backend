require('dotenv').config();
const mongoose = require('mongoose');
const config = { useUnifiedTopology: true, useNewUrlParser: true };
const { MONGODB_URL } = process.env;

//connect
mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

//message
mongoose.connection
    .on('open', () => console.log('Green Light Go!'))
    .on('close', () => console.log('Red Light NOGO!'))
    .on('error', (error) => console.log(error));

module.exports = mongoose;
