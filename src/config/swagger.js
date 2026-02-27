import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Loco Munch API',
            version: '1.0.0',
            description: 'API documentation for the Loco Munch server side',
            contact: {
                name: 'API Support',
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.SERVER_PORT || 3000}`,
                description: 'Development server',
            },
        ],
        components: {
            schemas: {
                Admin: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        email: { type: 'string' },
                        password: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        password: { type: 'string' },
                        phone: { type: 'string' },
                        adminId: { type: 'integer' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Item: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        image: { type: 'string' },
                        price: { type: 'number', format: 'double' },
                        description: { type: 'string' },
                        availability: { type: 'boolean' },
                        restaurantId: { type: 'integer' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Restaurant: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        address: { type: 'string' },
                        phone: { type: 'string' },
                        image: { type: 'string' },
                        adminId: { type: 'integer' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Order: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        totalAmount: { type: 'number', format: 'double' },
                        status: { type: 'string' },
                        userId: { type: 'integer' },
                        stationId: { type: 'integer' },
                        trainId: { type: 'integer' },
                        pickupPersonId: { type: 'integer' },
                        deliveryPersonId: { type: 'integer' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                // Add more schemas as needed based on models
            },
        },
    },
    apis: ['./src/routes/*.js', './server.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
