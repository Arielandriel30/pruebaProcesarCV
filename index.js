require('dotenv').config();
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const fs = require('fs').promises;  
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

const PORT = 3000;

app.post('/upload', upload.single('cv'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        console.log('Archivo recibido:', req.file);

        const filePath = path.join(__dirname, req.file.path);

        const dataBuffer = await fs.readFile(filePath);  
        const pdfData = await pdfParse(dataBuffer);
        const extractedText = pdfData.text;

        const prompt = `Basándote en el siguiente CV, generá 5 preguntas técnicas relevantes para una entrevista en ESPAÑOL:\n\n${extractedText}\n\nPreguntas:`;

        const response = await axios.post(
            'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
            { inputs: prompt },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                timeout: 60000,
            }
        );

        await fs.unlink(filePath); 

        res.json({
            preguntas: response.data[0]?.generated_text || response.data,
        });

    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Hubo un problema analizando el CV.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
