const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// set up to serve the swagger docs
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rair Decrypt Node',
      version: '0.0.1',
    },
  },
  apis: ['./bin/routes/*.js'],
};

const router = express.Router();
const swaggerSpec = swaggerJSDoc(options);
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
module.exports = router;
