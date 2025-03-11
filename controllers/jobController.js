const jobService = require('../services/jobService');
const submitJob = async (req, res) => {
    try {
        const job = await jobService.createJob(req.body);
        res.status(201).json({ job_id: job.job_id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getJobStatus = async (req, res) => {
    try {
        const job = await jobService.getJobStatus(req.query.jobid);
        if (!job) return res.status(400).json({});

        const response = { 
            job_id: req.query.jobid,  
            status: job.status 
        };

        if (job.status === 'failed' && job.visits) {
            response.error = job.visits
                .filter(v => v.error) 
                .map(v => ({ store_id: v.store_id, error: v.error }));
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};





module.exports = { submitJob, getJobStatus };