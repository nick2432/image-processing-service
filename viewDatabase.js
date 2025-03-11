const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/jobModel'); // Adjust path if needed

dotenv.config();

const viewDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: 'retail_pulse' });

        console.log('✅ Connected to MongoDB');

        const jobs = await Job.find({});
        console.log('📊 Job Data:', JSON.stringify(jobs, null, 2));

        mongoose.connection.close();
        console.log('🔌 Database connection closed.');
    } catch (error) {
        console.error('❌ Error retrieving database data:', error);
        process.exit(1);
    }
};

viewDatabase();
