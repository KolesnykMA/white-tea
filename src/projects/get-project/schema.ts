export default {
  type: 'object',
  properties: {
    pathParameters: {
      type: 'object',
      properties: {
        projectId: {type: 'string', minLength: 1, maxLength: 20},
      },
      required: ['projectId'],
    },
  },
};
