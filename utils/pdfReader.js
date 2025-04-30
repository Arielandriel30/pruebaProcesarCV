const fs = require('fs').promises;
const pdfParse = require('pdf-parse');

async function leerPDF(filePath) {
    const dataBuffer = await fs.readFile(filePath);
    const pdfData = await pdfParse(dataBuffer);
    await fs.unlink(filePath);
    return pdfData;
}

module.exports = { leerPDF };
