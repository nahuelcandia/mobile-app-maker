/* #License 
 * 
 * The MIT License (MIT)
 * 
 * This software consists of voluntary contributions made by many
 * individuals. For exact contribution history, see the revision history
 * available at https://github.com/shovelapps/shovelapps-cms
 * 
 * The following license applies to all parts of this software except as
 * documented below:
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * All files located in the node_modules and external directories are
 * externally maintained libraries used by this software which have their
 * own licenses; we recommend you read them, as their terms may differ from
 * the terms above.
 * 
 * Copyright (c) 2014-2015 Shovel apps, Inc. All rights reserved.
 * (info@shovelapps.com) / www.shovelapps.com / www.shovelapps.org
 */

/*global $:false */
/*global __:false */

function notificate(message, type, icon, closable) {
  closable = (typeof closable === 'undefined' ? true : closable);
  var html = '<div id="notification" class="alert alert-' + type + ' alert-dismissable page-alert">';
  if (closable) html += '<button type="button" class="close"><span aria-hidden="true">×</span><span class="sr-only">' + __('Close') + '</span></button>';
  html += '<i class="icon ' + icon + '"/></i> ';
  html += message;
  html += '</div>';
  $(html).hide().prependTo('#notifications').slideDown();
}

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