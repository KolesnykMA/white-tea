export default {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        title: {type: 'string'},
        status: {
          type: 'string',
          enum: ['todo', 'inProgress', 'done'],
        },
        projectId: {type: 'string'},
        featureId: {type: 'string'},
        releaseId: {type: 'string'},
        executiveId: {type: 'string'},
      },
      required: ['title'],
    },
  },
};
