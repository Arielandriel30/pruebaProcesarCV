const axios = require('axios');

async function getQuestions(cvText) {
    const prompt = `Basándote en el siguiente CV, generá 5 preguntas técnicas relevantes para una entrevista en ESPAÑOL:\n\n${cvText}\n\nPreguntas:`;

    const response =  await axios.post(
        'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
        {inputs: prompt},
        {
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
            },
            timeout: 40000,
        }
    );
    return [response.data[0]?.generated_text || response.data];
}

module.exports = {
    name: 'huggingface',
    getQuestions,
};