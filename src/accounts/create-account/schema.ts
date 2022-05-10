export default {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        name: {type: 'string'},
        email: {type: 'string'},
        password: {type: 'string'},
        firstName: {type: 'string'},
        lastName: {type: 'string'},
      },
      required: ['name', 'email', 'password', 'firstName', 'lastName'],
    },
  },
};
