export default {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        name: {type: 'string'},
        email: {type: 'string'},
      },
      required: ['name', 'email'],
    },
  },
};
