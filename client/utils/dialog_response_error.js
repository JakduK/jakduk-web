import Vue from 'vue';

export default function (fnMessage) {
  return function (response) {
    const message = fnMessage ? fnMessage(response) : '';

    if (message) {
      window.alert(Vue.t(message));
    } else if (response.status === 401) {
      if (window.confirm(Vue.t('common.do.you.want.to.login'))) {
        window.location = `/login?redir=${encodeURIComponent(`${location.pathname}${location.search}`)}`;
      }
    } else if (response.status >= 500) {
      window.alert(Vue.t('common.error.occurred.on.server'));
    } else {
      window.alert(Vue.t('common.network.in.problem'));
    }
  };
}
