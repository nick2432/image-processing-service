const mongoose = require('mongoose');
require('dotenv').config(); 

const isDocker = process.env.DOCKER_ENV === 'true';

const MONGO_URI = isDocker
    ? "mongodb+srv://finikhil2432:pFXkCy6CVQYM82t1@cluster0.l44y4.mongodb.net/retail_pulse?retryWrites=true&w=majority"
    : process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, { 
            dbName: 'retail_pulse', 
        });

        console.log('✅ MongoDB Successfully Connected');
        
        mongoose.connection.on('open', () => {
            console.log('✅ MongoDB Connection Open and Ready');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB Connection Error:', err);
            process.exit(1);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB Disconnected. Retrying...');
        });

    } catch (err) {
        console.error('❌ MongoDB Initial Connection Failed:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
