const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/jobModel'); 

dotenv.config();

const clearDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: 'retail_pulse' });

        console.log('✅ Connected to MongoDB');
        
        await Job.deleteMany({});
        console.log('🗑️  All job data removed from the database.');

        mongoose.connection.close();
        console.log('🔌 Database connection closed.');
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        process.exit(1);
    }
};

clearDatabase();
