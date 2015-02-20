---
layout: default
---

#API

The API is distributd in the backend and in the frontend. There are also some methods avaiable just for the admin panel. 

The CMS emits events locally (via a regular EventEmitter) and events through socket.io. 

## Backend events

These events are emitted on the express() application object.

* `apkBuilt`: Emitted when the CMS has compiled the app for the Android platform through the `buildservice` plugin. This event causes the frontend to be notified via the socket.io event `apkBuilt`.
* `source code upload progress`: Emitted when the zip file with the app created by the CMS is uploading to the Shovel apps Platform in order to be compiled.
* `upload-complete`. Emitted when the zip file containt the app created by the CMS has finished uploading. At this moment, the platform will compile it for the differente mobile platforms


### socket.io events 

#### Events emitted by the backend through the Backend socket.

* `apkBuilt`: Emitted when the CMS has compiled the app for the Android platform through the `buildservice` plugin.
* `doin nothing`: Emitted when a new client connects to the backend admin panel in order to tell the frohtend that it can enable the build button.
* `error rendering fronted`: Emmited when there was an error creating the rendered version of the app.
* `finished zipping`: Emitted when the CMS could succesfully render the app and package it into a zip file.
* `platform connect`: Emittend when the CMS could connect succesfully to Shovel apps Platform.
* `source code upload progress`: Emitted when the zip file with the app created by the CMS is uploading to the Shovel apps Platform in order to be compiled.
* `upload-complete`. Emitted when the zip file containt the app created by the CMS has finished uploading. At this moment, the platform will compile it for the differente mobile platforms

#### Events emitted by the frontend through the backend socket.

* `already working`: Emitted by the frontend in order to figure out if the backend is compiling the app.
* `buildApk`: Emitted by the frontend in order to request the backend a new compilation. 

## Hooks

Internally Shovel apps CMS uses [hooke](https://www.npmjs.com/package/hooke) offering thus, hooks for plugins and modules.

*`frontend.hook("render", done)`: Offer

**Arguments**

* done(app, locals, cb)
 * `err` - null if nothing bad happened.
 * `data` - Object.
  * `html` - render html as a string.
 * `locals` - object passed as locals to the render function

*`frontend.hook("render", done)`: Offer
