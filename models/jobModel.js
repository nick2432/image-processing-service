const { Schema, model } = require('mongoose');

const JobSchema = new Schema({
    job_id: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'ongoing', 'completed', 'failed'], default: 'pending' },
    visits: [
        {
            store_id: String,
            image_url: [String],
            visit_time: String,
            result: [{ image_url: String, perimeter: Number }],
            error: String, 
        }
    ],
    createdAt: { type: Date, default: Date.now },
});

module.exports = model('Job', JobSchema);
