try {
  pushNotification = window.plugins.pushNotification;

  //register event
  if (device.platform == 'android' || device.platform == 'Android' ||
    device.platform == 'amazon-fireos') {

    pushNotification.register(successHandler, errorHandler, {
      "senderID": "153292884918", //Google developer console proyect id
      "ecb": "onNotification" //android function
    });
  } else {
    pushNotification.register(tokenHandler, errorHandler, {
      "badge": "true",
      "sound": "true",
      "alert": "true",
      "ecb": "onNotificationAPN" //ios function
    });
  }
} catch (err) {
  console.log("ios device registration error");
  console.log(err.message);
}



//ios notification handler
function onNotificationAPN(e) {

  //play custon sound
  if (e.sound) {

    var soundfile = e.sound;

    var path = window.location.pathname;


    //REVISAR BUSCAR UNA MEJOR FORMA DE BRINDAR EL PATH
    path = path.substr(path, path.length - 10);
    path = 'file://' + path;


    var my_media = new Media('sounds/' + soundfile);
    my_media.play();
  }


  //show notification on frontend
  myApp.addNotification({
    title: e.payload['title'],
    message: e.alert
  });

}

// Android notification handler
function onNotification(e) {

  var registerDB = new Firebase("https://shovelChat.firebaseio.com/registered");

  switch (e.event) {
    case 'registered':
      if (e.regid.length > 0) {

        //add device id to db
        registerDB.once('value', function(snapshot) {
          if (!snapshot.hasChild(device.uuid)) {
            registerDB.child(device.uuid).set({
              gcmId: e.regid
            });
          }
        });

      }
      break;

      //notification recived
    case 'message':

      //play custom sound
      var soundfile = e.payload.sound;

      var path = window.location.pathname;

      //REVISAR BUSCAR UNA MEJOR FORMA DE BRINDAR EL PATH
      path = path.substr(path, path.length - 10);
      path = 'file://' + path;

      var my_media = new Media(path + 'sounds/' + soundfile);
      my_media.play();

      //show notification on frontend
      myApp.addNotification({
        title: e.payload.title,
        message: e.payload.message
      });
      break;

    case 'error':
      console.log("notification error Android");
      break;

    default:

      break;
  }
}


function tokenHandler(result) {
  //add device id to db
  var registerDBIos = new Firebase("https://shovelChat.firebaseio.com/registeredIos");

  registerDBIos.once('value', function(snapshot) {
    if (!snapshot.hasChild(result)) {
      registerDBIos.child(result).set({
        apnId: result
      });
    }
  });

}

function successHandler(result) {
  //succes handler Android
}

function errorHandler(error) {
  //error handler both
}