//requires

var gcm = require('node-gcm');
var apn = require('apn');
var config = require('./defaults.json');


module.exports = shovelMessenger;

function shovelMessenger(app, server, sockets) {
  var _this = this;
  _this.gcmSender = config.gcmServerApiKey;
  _this.regIdsGcm = config.regIdsGcm;
  _this.regIdsApn = config.regIdsApn;
  _this.ApnConfig = config.ApnConfig;

  app.post("/admin/push", function(req, res, next) {
    var msgOptions = {};
    msgOptions.message = req.param('notification');
    msgOptions.title = req.param('title');
    msgOptions.sound = req.param('sound');
    _this.sendMessage(msgOptions);
  });

  app.get("/admin/push", function(req, res, next) {
    res.render("../admin/admin-push");
  });



}

shovelMessenger.prototype.sendMessage = function(msgOptions) {
  var _this = this;

  //gcm
  //preparo el mensaje
  var message = new gcm.Message({
    collapseKey: 'New Notifications',
    delayWhileIdle: true,
    timeToLive: 3,
    data: {
      message: msgOptions.message,
      title: msgOptions.title,
      timeStamp: new Date().toISOString(),
      sound: msgOptions.sound
    }
  });

  _this.gcmSender.send(message, _this.regIdsGcm, 4, function(err, result) {
    console.log(err);
    console.log(result);
  });


  //apn
  var errorApn = function(errorNum, notification) {
    console.log('Error is: %s', errorNum);
    console.log("Note " + notification);
  }

  var options = _this.ApnConfig;
  options.errorCallback = errorApn;

  var apnConnection = new apn.Connection(options);

  //preparo mi notificacion
  var note = new apn.Notification();
  note.sound = msgOptions.sound;
  note.alert = msgOptions.message;
  note.payload = {
    'title': msgOptions.title
  };
  //envio la notificacion a apn
  apnConnection.pushNotification(note, _this.regIdsIos);

}