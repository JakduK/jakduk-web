import Vue from 'vue';
import VueI18n from 'vue-i18n';
import $ from 'jquery';

Vue.use(VueI18n);

function loadI18nBundle(locale) {
  const deferred = $.Deferred();
  require(`bundle-loader!../../assets/i18n/${locale}.json`)(bundle => {
    deferred.resolve(bundle);
  });
  return deferred;
}

function loadMomentLocale(locale) {
  const deferred = $.Deferred();
  if (locale === 'en' || locale === 'en-US') {
    deferred.resolve();
  } else {
    require(`bundle-loader!../../node_modules/moment/locale/${aliasLocale(locale)}.js`)(() => {
      deferred.resolve();
    });
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
  return $.when(
    loadI18nBundle(locale),
    loadMomentLocale(locale)
  ).done(i18nBundle => {
    Vue.config.lang = locale;
    Vue.config.fallbackLang = 'en';
    Vue.locale(locale, i18nBundle);
  });
}
