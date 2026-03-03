export const successResponse = (message, data = null) => {
    return {
        success: true,
        message,
        data
    };
};

export const clientErrorResponse = (message) => {
    return {
        success: false,
        message
    };
};

export const serverErrorResponse = (message) => {
    return {
        success: false,
        message
    };
};