export const handler = async (event: any, context: any, callback: any) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello',
        }),
    };

    callback(null, response);
};


