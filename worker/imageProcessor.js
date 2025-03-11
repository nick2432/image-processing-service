const axios = require('axios');
const { workerData, parentPort } = require('worker_threads');

const processImages = async (visit) => {
    let result = [];
    for (const imageUrl of visit.image_url) {
        try {
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

            if (response.status !== 200) {
                throw new Error("Invalid response");
            }

            const image = Buffer.from(response.data);
            const dimensions = { width: 200, height: 100 }; // Mocked
            const perimeter = 2 * (dimensions.width + dimensions.height);

            result.push({ image_url: imageUrl, perimeter });
        } catch (error) {
            console.error(`❌ Failed to process image: ${imageUrl}`, error.message);
            result.push({ image_url: imageUrl, error: 'Failed to process' });
        }
    }
    return { store_id: visit.store_id, result };
};

processImages(workerData).then((data) => parentPort.postMessage(data));
