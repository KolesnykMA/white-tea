export default {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        name: {type: 'string', minLength: 1, maxLength: 20},
      },
      required: ['name'],
    },
  },
};
