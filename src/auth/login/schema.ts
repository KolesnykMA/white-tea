export default {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        email: {type: 'string', format: 'email'},
        password: {type: 'string', minLength: 8, maxLength: 30},
      },
      required: ['email', 'password'],
    },
  },
};
