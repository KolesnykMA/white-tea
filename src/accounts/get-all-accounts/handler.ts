import prismaClient from "../../../libs/dal/client/client";

export const handler = async (event: any, context: any, callback: any) => {
    const accounts = await prismaClient.account.findMany()

    const response = {
        statusCode: 200,
        body: JSON.stringify(accounts),
    };

    callback(null, response);
};


