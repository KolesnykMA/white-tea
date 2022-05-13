export default {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        email: {type: 'string', minLength: 1, maxLength: 20},
        password: {type: 'string', minLength: 1, maxLength: 20},
      },
      required: ['email', 'password'],
    },
  },
};
