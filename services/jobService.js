const Job = require('../models/jobModel');
const { v4: uuidv4 } = require('uuid');
const { addJobToQueue } = require('../queues/jobQueue');  

const createJob = async (jobData) => {
    if (!jobData.count || !Array.isArray(jobData.visits)) {
        throw new Error('Invalid job data: "count" and "visits" are required.');
    }

    if (jobData.visits.length !== jobData.count) {
        throw new Error('Invalid job data: "count" does not match the number of visits.');
    }

    for (const visit of jobData.visits) {
        if (!visit.store_id || !visit.image_url || !visit.visit_time) {
            throw new Error('Invalid job data: Each visit must have "store_id", "image_url", and "visit_time".');
        }
    }

    const job_id = uuidv4();
    const newJob = new Job({ job_id, status: 'pending', visits: jobData.visits });
    await newJob.save();

    await addJobToQueue({ job_id, visits: jobData.visits });

    return newJob;
};


const getJobStatus = async (job_id) => {
    return await Job.findOne(
        { job_id },
        { job_id: 1, status: 1, 'visits.store_id': 1, 'visits.error': 1, _id: 0 }
    );
};



module.exports = { createJob, getJobStatus };
