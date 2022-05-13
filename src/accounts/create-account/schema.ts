export default {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        name: {type: 'string', minLength: 1, maxLength: 20},
        email: {type: 'string', minLength: 1, maxLength: 20},
        password: {type: 'string', minLength: 1, maxLength: 20},
        firstName: {type: 'string', minLength: 1, maxLength: 20},
        lastName: {type: 'string', minLength: 1, maxLength: 20},
      },
      required: ['name', 'email', 'password', 'firstName', 'lastName'],
    },
  },
};
