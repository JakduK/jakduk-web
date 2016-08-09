module.exports = {
  origin: process.env.ORIGIN || 'http://localhost:3000',
  apiServerUrl: process.env.API_SERVER || 'http://localhost:3000/api',
  internalApiServerUrl: process.env.INTERNAL_API_SERVER || 'http://localhost:8080/api',
  thumbnailServerUrl: process.env.THUMBNAIL_SERVER || 'http://localhost:8080'
};
