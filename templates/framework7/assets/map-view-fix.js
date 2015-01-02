$$('.view').on('show', function() {
  currentView = this.getAttribute('id');
  if (currentView == 'view-map') {
    f7.params.swipePanel = false;
    google.maps.event.trigger(map, 'resize');
  } else {
    f7.params.swipePanel = 'left';
  }
});