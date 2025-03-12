const { Worker } = require('bullmq');
const redis = require('../config/redis');
const Job = require('../models/jobModel');
const { Worker: NodeWorker } = require('worker_threads');
const path = require('path');
const connectDB = require('../config/db');
require('dotenv').config();

console.log('Initializing Worker...');

const startWorker = async () => {
    await connectDB();
    console.log('MongoDB Connected');

    const jobWorker = new Worker('jobQueue', async (job) => {
        console.log(`Processing job: ${job.id}`);
        console.log('Job Data:', job.data);

        const { job_id, visits } = job.data;

        try {
            await Job.findOneAndUpdate({ job_id }, { status: 'ongoing' });

            console.log(`⏳ Starting image processing for job: ${job_id}`);

            for (const visit of visits) {
                console.log(`Processing images for store_id: ${visit.store_id}`);

                try {
                    const result = await processImagesInWorker(visit);

                    if (result.result.some(img => img.error)) {
                        console.error(`Image processing failed for store_id: ${visit.store_id}`);
                        
                        await Job.findOneAndUpdate(
                            { job_id },
                            { status: 'failed' }
                        );

                        await Job.updateOne(
                            { job_id, 'visits.store_id': visit.store_id },
                            { $set: { 'visits.$.error': 'Image processing failed' } }
                        );

                        return; 
                    }

                    console.log(`Image processed for store_id: ${visit.store_id}`);

                    await Job.findOneAndUpdate(
                        { job_id, 'visits.store_id': visit.store_id },
                        { $set: { 'visits.$.result': result.result } }
                    );

                } catch (error) {
                    console.error(`Error processing store_id: ${visit.store_id}`, error.message);

                    await Job.findOneAndUpdate(
                        { job_id },
                        { status: 'failed' }
                    );

                    await Job.updateOne(
                        { job_id, 'visits.store_id': visit.store_id },
                        { $set: { 'visits.$.error': error.message } }
                    );

                    return; 
                }
            }

            console.log(`Job ${job_id} completed successfully`);
            await Job.findOneAndUpdate({ job_id }, { status: 'completed' });

        } catch (error) {
            console.error(`Job ${job_id} failed:`, error.message);
            await Job.findOneAndUpdate({ job_id }, { status: 'failed' });
        }
    }, { connection: redis, concurrency: 2 });

    console.log('Worker started listening for jobs');
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const processImagesInWorker = (visit) => {
    return new Promise((resolve, reject) => {
        const worker = new NodeWorker(path.resolve(__dirname, 'imageProcessor.js'), {
            workerData: visit
        });

        worker.on('message', async (result) => {
            const randomDelay = Math.floor(Math.random() * 300) + 100; 
            await sleep(randomDelay);

            resolve(result);
        });
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
        });
    });
};

startWorker();
module.exports = startWorker;
