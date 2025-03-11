const { Queue } = require('bullmq');
const redis = require('../config/redis');


const jobQueue = new Queue('jobQueue', {
    connection: redis,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
        attempts: 3 
    }
});

const addJobToQueue = async (jobData) => {
    const job = await jobQueue.add('processJob', jobData);
    console.log(`✅ Job added to queue: ${job.id}`);
};
;

module.exports = { jobQueue, addJobToQueue }; 
