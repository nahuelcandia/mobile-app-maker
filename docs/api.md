---
layout: default
---

#API

The API is distributd in the backend and in the frontend. There are also some methods avaiable just for the admin panel. 




The CMS emits events locally (via a regular EventEmitter) and events through socket.io. 

## Backend objects

### app

An **express** instance. Use regular [express methods](http://expressjs.com/api.html) for extending the CMS backend.

The `app` variable only exists at `server.js` but it gets passed as first parameter
to every plugin's `index.js` when they're loaded.

_Modules inside the `lib` folder are also passed `app` as first parameter`_.

__Example__

Suppose you create a plugin called `foo`, then in your file `/plugins/foo/index.js`
you can do:

    module.exports = function(app,server,sockets) {
      app.get("/foo", function(req,res) {
        res.send("Bar");
      });
    };

### app.cms

the `cms` property under the `app` object holds a reference to every module
loaded by `server.js` from the `/lib` folder.

As every `/lib` module is loaded expecting an exported function, the function is called.

Thus, what `app.cms` holds as keys are the returns values by every module.

### server

The `http` or `https` server on which the express application is attached.

### app.cms.sockets

 **Shovel apps CMS** creates three websockets for communicating 
with the **App frontend**, the **CMS Admin Panel** and **Shovel apps build Platform**.
The latter connection allows the CMS to build the app for you without worrying
about installing Phonegap in your own machine. 

* `app.cms.sockets.frontend` - A `socket.io` server for the default namespace (`/`).
* `app.cms.sockets.adminPanel` - A `socket.io` server to the namespace (`/admin`).
* `app.cms.sockets.platform` - A `socket.io` client to Shovel apps build platform.

## Backend events

**Shovel apps CMS** relies on [socket.io](https://www.npmjs.com/package/socket.io) to send and
receive events between the backend and the admin panel, the backend and the frontend, and the backend and the mobile app.

### app object events

These events are emitted on the [app](#app) object.

* `apkBuilt`: Emitted when the CMS has compiled the app for the Android platform through the `buildservice` plugin. This event causes the frontend to be notified via the socket.io event `apkBuilt`.
* `source code upload progress`: Emitted when the zip file with the app created by the CMS is uploading to the Shovel apps Platform in order to be compiled.
* `upload-complete`. Emitted when the zip file containt the app created by the CMS has finished uploading. At this moment, the platform will compile it for the differente mobile platforms


### socket.io events 

#### Events emitted by the backend through the admin panel socket.

* `apkBuilt`: Emitted when the CMS has compiled the app for the Android platform through the `buildservice` plugin.
* `doin nothing`: Emitted when a new client connects to the backend admin panel in order to tell the frohtend that it can enable the build button.
* `error rendering fronted`: Emmited when there was an error creating the rendered version of the app.
* `finished zipping`: Emitted when the CMS could succesfully render the app and package it into a zip file.
* `platform connect`: Emittend when the CMS could connect succesfully to Shovel apps Platform.
* `source code upload progress`: Emitted when the zip file with the app created by the CMS is uploading to the Shovel apps Platform in order to be compiled.
* `upload-complete`. Emitted when the zip file containt the app created by the CMS has finished uploading. At this moment, the platform will compile it for the differente mobile platforms

#### Events emitted by the frontend through the admin panel socket.

* `already working`: Emitted by the frontend in order to figure out if the backend is compiling the app.
* `buildApk`: Emitted by the frontend in order to request the backend a new compilation. 

## Hooks

Internally Shovel apps CMS backend trigers events that result in some actions
and offer hooks for you as a developer to hang on and add custom functionality. 

This behaviour is achieved via the [hooke](https://www.npmjs.com/package/hooke) offering thus, hooks for plugins and modules.

### Hooking to events

#### app.cms.frontend.hook("render", done)

**Arguments**

* done(data, locals)
 * `data` - Object.
  * `html` - render html as a string.
 * `locals` - object passed as locals to the render function

### Triggering hookable events

Running hookable events. Hooks get executed when someone calls `.trigger()`
on a hookable object. Every triggered event needs different parameters
specific to task the imply.

#### app.cms.frontend.trigger("render", data, locals, done)

* done(app, locals, cb)
 * `err` - null if nothing bad happened.
 * `data` - Object.
  * `html` - render html as a string.
 * `locals` - object passed as locals to the render function
