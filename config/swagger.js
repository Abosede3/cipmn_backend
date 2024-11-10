const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CIPMN App',
            version: '1.0.0',
            description: 'API documentation for the CIPMN App',
        },
        servers: [
            {
                url: 'http://localhost:3001/api',
                description: 'Local server',
            }, 
            {
                url: 'https://cipmn-backend.onrender.com/api',
                description: 'Test server',
            }, 
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [path.join(__dirname, '../routes/*.js'), path.join(__dirname, '../models/*.js')],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
