export default {
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || '6nl927hv',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production'
  },
  project: {
    basePath: '/'
  }
};
