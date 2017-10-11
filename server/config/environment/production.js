module.exports = {
  staging: {
    origin: process.env.ORIGIN || 'https://dev-web.jakduk.com',
    apiServerUrl: process.env.API_SERVER || '/api',
    internalApiServerUrl: process.env.INTERNAL_API_SERVER || 'https://dev-api.jakduk.com/api',
    thumbnailServerUrl: process.env.THUMBNAIL_SERVER || 'https://dev-api.jakduk.com',
    secureCookie: false,
    debug: true
  },
  prod: {
    origin: process.env.ORIGIN || 'https://jakduk.com',
    apiServerUrl: process.env.API_SERVER || '/api',
    internalApiServerUrl: process.env.INTERNAL_API_SERVER || 'https://api.jakduk.com/api',
    thumbnailServerUrl: process.env.THUMBNAIL_SERVER || 'https://api.jakduk.com',
    gaAccount: 'UA-59051176-1',
    secureCookie: false,
    debug: false
  }
};
