module.exports = {
  staging: {
    origin: process.env.ORIGIN || 'http://staging.jakduk.com',
    apiServerUrl: process.env.API_SERVER || '/api',
    internalApiServerUrl: process.env.INTERNAL_API_SERVER || 'http://staging.jakduk.com:8080/api',
    thumbnailServerUrl: process.env.THUMBNAIL_SERVER || 'http://staging.jakduk.com:8080',
    secureCookie: false,
    debug: true
  },
  prod: {
    origin: process.env.ORIGIN || 'http://jakduk.com',
    apiServerUrl: process.env.API_SERVER || '/api',
    internalApiServerUrl: process.env.INTERNAL_API_SERVER || 'http://api.jakduk.com/api',
    thumbnailServerUrl: process.env.THUMBNAIL_SERVER || 'http://api.jakduk.com',
    gaAccount: 'UA-59051176-1',
    secureCookie: false,
    debug: false
  }
};
