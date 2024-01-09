const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse'); // You need to install this package

const directoryPath = './pdfs';

// Read files from directory
fs.readdir(directoryPath, function (err, files) {
    if (err) {
        console.log('Error getting directory information.');
        return;
    }

    // Filter out non-PDF files
    const pdfFiles = files.filter(file => path.extname(file) === '.pdf');

    // Create a promise for each PDF's page count
    const pageCountPromises = pdfFiles.map(file => {
        const filePath = path.join(directoryPath, file);
        const dataBuffer = fs.readFileSync(filePath);
        return pdfParse(dataBuffer).then(pdfData => pdfData.numpages);
    });

    // Execute all promises and sum the page counts
    Promise.all(pageCountPromises)
        .then(pageCounts => {
            const totalCount = pageCounts.reduce((sum, pageCount) => sum + pageCount, 0);
            console.log(`Total Number of Pages: ${totalCount}`);
        })
        .catch(err => {
            console.error('Error processing PDF files', err);
        });
});