function notificate(message, type, icon, closable) {
  var closable = (typeof closable === 'undefined' ? true : closable)
  var html = '<div id="notification" class="alert alert-' + type + ' alert-dismissable page-alert">';
  if (closable) html += '<button type="button" class="close"><span aria-hidden="true">×</span><span class="sr-only">' + __('Close') + '</span></button>';
  html += '<i class="icon ' + icon + '"/></i> ';
  html += message;
  html += '</div>';
  $(html).hide().prependTo('#notifications').slideDown();
};
$(function() {
  $('body').myelement().on('disconnect', function() {
    $('.live-btn').attr('disabled', true);
    $('a').attr('disabled', true).css({
      'pointer-events': 'none'
    });
    notificate(__('Check your internet connection, it seems that we are disconnected.'), 'danger', 'ion-alert-circled', false);
  }).on('reconnect', function() {
    $('.live-btn').removeAttr('disabled');
    $('#notification').alert('close');
    notificate(__('Connection restablished.'), 'success', 'ion-checkmark-circled', false);
    $('#notification').delay(2500).fadeOut(function() {
      $('#notification').alert('close');
    });
    $('a').removeAttr('disabled').css({
      'pointer-events': 'auto'
    });
  });
});