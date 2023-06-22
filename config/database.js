const mongoose = require('mongoose');
const mongoUrl = 'mongodb://127.0.0.1:27017/SessionAuthApp';
//connect mongoDB
const dbConnect = async ()=>{
    try {
        await mongoose.connect(mongoUrl);
        console.log('Database connection successfully');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
dbConnect();
