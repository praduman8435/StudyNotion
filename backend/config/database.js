const mongoose = require('mongoose');
require('dotenv').config();


exports.connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connected succcessfully');
    } catch (error) {
        console.log('Error while connecting server with Database');
        console.log(error);
        throw error;
    }
};
