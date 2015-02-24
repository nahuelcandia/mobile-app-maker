---
layout: default
---

## Plugins

Plugins extend **Shovel apps CMS** backend features or the frontend by using extra
scripts or whatever HTML you want for extending the core.

Every plugin should be presented as a directory inside the plugins directory.

The plugin will be loaded using [require()](http://nodejs.org/api/modules.html#modules_module_require_id) as is the standard in node
for loading modules, (i.e. the [CommonJS](http://en.wikipedia.org/wiki/CommonJS) interface), thus, the `index.js` file
will be the main file for the plugin. 

    shovelapps-cms
    └── plugins
        └── chat    

### Required files

Server side plugins are also called node modules since all backend at **Shovel apps CMS** runs in [NodeJS](http://nodejs.org).

You need at least an `index.js` file inside the plugin directory.

### File structure of a plugin

The minimum structure a module **must** have is:

* A `plugin-name` folder inside `/plugins` directory.
* An `index.js` file within `plugin-name`.
* A `module.exports` clause inside `index.js` file _exporting_ a `function()`.
* A `package.json` file within `plugin-name` describing the module as any **NodeJS** module does.


####index.js


The file `index.js` is a regular NodeJS module. I.e. you write it
like any other module that is loaded by `require()`.
**Shovel apps CMS** will run that `index.js`  on start. 

In fact, it will asumme the plugin exports a function (`module.exports = functionName`)
and call it with 3 arguments that let you extend the CMS.

**plugins/myplugin/index.js**

    module.exports = myplugin;

    function myplugin(app, server, sockets) {
      
    }


#####Plugin exported function

The function exported by the `index.js` of a plugin receives these 3 arguments

* **app:**. The express app object (i.e, the request handler by calling `express()` ). 
* **server:** The server on which this plugin is being initialized
* **sockets:** **Shovel apps CMS** creates three websockets for communicating 
with the **App frontend**, the **CMS Admin Panel** and **Shovel apps build Platform**.
The latter connection allows the CMS to build the app for you without worrying
about a Phonegap installation. 
*  * **socket.frontend**. A `socket.io` server for the default namespace (`/`).
*  * **socket.adminpanel**. A `socket.io` server to the  namespace (`/admin`).
*  * **socket.adminpanel**. A `socket.io` server to the  namespace (`/admin`).

The exported function will receive `app`, `server` and `sockets` parameters
in order for you to extend the CMS. *Remember, the cms backend is an express app*.


### Views inside a plugin

Put your views inside the plugin folder and render them like a regular
express view.

You may use the `path.resolve(__dirname, "view.jade")` pattern for simplyfing
access to the view file.

        var resolve = require("path").resolve;

        module.exports = function(app) {
            app.get("/admin/chat", function(req,res) {
            res.render(resolve(__dirname, "index.jade"));
            });
        }

#### Example

If the plugin is called `chat`, you will need:

* A `chat` folder inside the `/plugins` directory.
* An `index.js` file within `plugins/chat`.
* A `module.exports` clause inside `index.js` file _exporting_ a `function()`.
* A `package.json` file within `chat` describing the module as any **NodeJS** module does.

`plugins/chat/index.js`

    var resolve = require("path").resolve;

    module.exports = function(app) {

    }
