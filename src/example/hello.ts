import { ulid } from "ulid";

export const handler = async (event: any, context: any, callback: any) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello ${ulid()}`,
    }),
  };

  callback(null, response);
};
