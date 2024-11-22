// middlewares/uploadCsvMiddleware.js

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadDir = './uploads/csv/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: function (req, file, cb) {
        cb(null, 'users_' + Date.now() + path.extname(file.originalname));
    },
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB file size limit
    fileFilter: function (req, file, cb) {
        // Check file type
        const filetypes = /csv/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Error: CSV files only!'));
        }

        console.log('File uploaded successfully');
    },
}).single('csvfile'); // The field name should match the name in the form data

module.exports = upload;
