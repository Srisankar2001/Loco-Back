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
        tags: [
            { name: 'Admins', description: 'Admin management' },
            { name: 'Users', description: 'User management' },
            { name: 'Restaurants', description: 'Restaurant management' },
            { name: 'DeliveryPersons', description: 'Delivery person management' },
            { name: 'PickupPersons', description: 'Pickup person management' },
            { name: 'ItemCategories', description: 'Product category management' },
            { name: 'Items', description: 'Restaurant item management' },
            { name: 'Orders', description: 'Order lifecycle management' },
            { name: 'DocumentVerification', description: 'Admin document verification endpoints' },
            { name: 'PickupLocations', description: 'Pickup person live location tracking' },
            { name: 'TrainLocations', description: 'Train driver login and train live location tracking' },
            { name: 'DefaultItems', description: 'Product catalog management' },
            { name: 'Reviews', description: 'Customer reviews' },
            { name: 'Search', description: 'Food search endpoints' },

        ],
        servers: [
            {
                url: `http://localhost:${process.env.SERVER_PORT || 3001}`,
                description: 'Development server',
            },
        ],
        components: {
            schemas: {
                Admin: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        firstname: { type: 'string' },
                        lastname: { type: 'string' },
                        email: { type: 'string' },
                        password: { type: 'string' },
                        phoneNumber: { type: 'string' },
                        isVerified: { type: 'boolean' },
                        isActive: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        firstname: { type: 'string' },
                        lastname: { type: 'string' },
                        email: { type: 'string' },
                        phoneNumber: { type: 'string' },
                        isVerified: { type: 'boolean' },
                        isActive: { type: 'boolean' },
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
                        email: { type: 'string' },
                        phoneNumber: { type: 'string' },
                        image: { type: 'string' },
                        isVerified: { type: 'boolean' },
                        isActive: { type: 'boolean' },
                        status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                PickupPerson: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        firstname: { type: 'string' },
                        lastname: { type: 'string' },
                        email: { type: 'string' },
                        phoneNumber: { type: 'string' },
                        isVerified: { type: 'boolean' },
                        isActive: { type: 'boolean' },
                        status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                DeliveryPerson: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        firstname: { type: 'string' },
                        lastname: { type: 'string' },
                        email: { type: 'string' },
                        phoneNumber: { type: 'string' },
                        isVerified: { type: 'boolean' },
                        isActive: { type: 'boolean' },
                        status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Review: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        rating: { type: 'integer', minimum: 0, maximum: 5 },
                        comment: { type: 'string' },
                        reply: { type: 'string' },
                        userId: { type: 'integer' },
                        restaurantId: { type: 'integer' },
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
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string' },
                        data: { type: 'object' },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' },
                        errors: { type: 'array', items: { type: 'string' } },
                    },
                },
                SearchResult: {
                    type: 'object',
                    properties: {
                        itemId: { type: 'integer' },
                        itemName: { type: 'string' },
                        itemImage: { type: 'string' },
                        itemDescription: { type: 'string' },
                        itemPrice: { type: 'number', format: 'double' },
                        categoryId: { type: 'integer' },
                        categoryName: { type: 'string' },
                        restaurantId: { type: 'integer' },
                        restaurantImage: { type: 'string' },
                        restaurantName: { type: 'string' },
                        latitude: { type: 'number', format: 'double' },
                        longitude: { type: 'number', format: 'double' },
                        distance: { type: 'number', format: 'double' },
                    },
                },
                SearchResponse: {
                    type: 'object',
                    properties: {
                        total: { type: 'integer' },
                        limit: { type: 'integer' },
                        offset: { type: 'integer' },
                        results: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/SearchResult' },
                        },
                    },
                },
            },
            securitySchemes: {
                tokenAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: 'Enter only the raw token value. Do not prefix it with Bearer.',
                },
            },
        },
        security: [
            {
                tokenAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js', './app.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
