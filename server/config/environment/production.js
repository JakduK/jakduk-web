module.exports = {
  staging: {
    origin: process.env.ORIGIN || 'https://staging.jakduk.com',
    apiServerUrl: process.env.API_SERVER || '/api',
    internalApiServerUrl: process.env.INTERNAL_API_SERVER || 'https://staging.jakduk.com:8080/api',
    thumbnailServerUrl: process.env.THUMBNAIL_SERVER || 'https://staging.jakduk.com:8080',
    secureCookie: true,
    debug: true
  },
  prod: {
    origin: process.env.ORIGIN || 'https://jakduk.com',
    apiServerUrl: process.env.API_SERVER || '/api',
    internalApiServerUrl: process.env.INTERNAL_API_SERVER || 'https://api.jakduk.com/api',
    thumbnailServerUrl: process.env.THUMBNAIL_SERVER || 'https://api.jakduk.com',
    gaAccount: 'UA-59051176-1',
    secureCookie: true,
    debug: false
  }
};
