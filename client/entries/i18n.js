import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const i18n = new VueI18n({
  fallbackLang: 'en',
});

function loadI18nBundle(locale) {
  return import(`../../assets/i18n/${locale}.json`).then(bundle => bundle.default);
}

function loadMomentLocale(locale) {
  if (locale !== 'en' && locale !== 'en-US') {
    return import(`../../node_modules/moment/locale/${aliasLocale(locale)}.js`)
  }

  function aliasLocale(locale) {
    if (locale.startsWith('ko')) {
      return 'ko';
    } else {
      return locale.toLowerCase();
    }
  }
}

export function load(locale) {
  return Promise.all([
    loadI18nBundle(locale),
    loadMomentLocale(locale)
  ]).then(([i18nBundle]) => {
    i18n.locale = locale;
    i18n.setLocaleMessage(locale, i18nBundle);
    return i18n
  });
}
