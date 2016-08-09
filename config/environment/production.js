module.exports = {
  staging: {
    origin: process.env.ORIGIN || 'https://staging.jakduk.com',
    apiServerUrl: process.env.API_SERVER || 'https://staging.jakduk.com/api',
    internalApiServerUrl: process.env.INTERNAL_API_SERVER || 'https://staging.jakduk.com:8080/api',
    thumbnailServerUrl: process.env.THUMBNAIL_SERVER || 'https://staging.jakduk.com:8080'
  },
  prod: {
    origin: process.env.ORIGIN || 'https://jakduk.com',
    apiServerUrl: process.env.API_SERVER || 'https://jakduk.com/api',
    internalApiServerUrl: process.env.INTERNAL_API_SERVER || 'https://api.jakduk.com/api',
    thumbnailServerUrl: process.env.THUMBNAIL_SERVER || 'https://api.jakduk.com',
    gaAccount: 'UA-59051176-1'
  }
};