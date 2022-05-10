import middy from '@middy/core';
import prismaClient from "libs/dal/client/client";
import logger from "libs/logger/logger";

export const handler = async (event: any, context: any, callback: any) => {
    const accounts = await prismaClient.account.findMany();
    logger.info(`Fetched ${accounts.length} accounts from db`);

    const response = {
        statusCode: 200,
        body: JSON.stringify(accounts),
    };

    callback(null, response);
};


