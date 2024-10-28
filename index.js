const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const cors = require('cors');
const path = require('path');

const routes = require('./routes');
const ejs = require('ejs');

const setupSwagger = require('./config/swagger');
const { logger, pe } = require('./middlewares/logger');

// Set the port
dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Setup static folder
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/', routes);

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Setup Swagger
setupSwagger(app);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(pe.render(err));
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
        }
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
