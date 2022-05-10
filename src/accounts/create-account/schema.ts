export default {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        name: {type: 'string'},
        firstName: {type: 'string'},
        lastName: {type: 'string'},
        email: {type: 'string'},
        password: {type: 'string'},
      },
      required: ['name', 'email'],
    },
  },
};
