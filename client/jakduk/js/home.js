require([
  'jquery',
  'semantic',
  'vue'
], function($) {
  $('#btnSidebar').click(function () {
    $('.ui.sidebar').sidebar('setting', {
      transition:'overlay'
    }).sidebar('toggle');
  });
  $('.ui.dropdown').dropdown();
  $('.ui.accordion').accordion();
  $('.ui.sticky').sticky({
    offset: 70
  });
  $('.logon.item').popup({
    inline: true,
    position : 'bottom right',
    on: 'click',
  });
});