## Plugins

Plugins extend **Shovel apps CMS**'s backend features or the frontend by using extra
scripts or whatever HTML you want for extending the core.

Every plugin should be presented as a directory inside the plugins directory.

The plugin will be loaded using [require()](http://nodejs.org/api/modules.html#modules_module_require_id) as is the standard in node
for loading modules, (i.e. the [CommonJS](http://en.wikipedia.org/wiki/CommonJS) interface), thus, the `index.js` file
will be the main file for the plugin. 

    shovelapps-cms
    └── plugins
        └── chat    

### Required files


You need at least an `index.js` file inside the plugin directory.

    shovelapps-cms
    └── plugins
        └── chat
            └── index.js



### File structure of a plugin

    shovelapps-cms
    └── plugins
        └── chat
            ├── chat.html
            └── index.js

####index.js


The file `index.js` is a regular `common.js` module. I.e. you write it
like any other module that is loaded by `var plugin  = require("plugin")`.
**Shovel apps CMS** will run that `index.js` like that on start. 

In fact, it will asumme the plugin exports a function (`module.exports = functionName`)
and calls it with 3 arguments that let you extend the CMS.


    module.exports = myModuleInit;

    function myModuleInit(app, server, sockets) {
      
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



A plugin is basically a piece of code that is reusable and / or detachable. 

To sum up, a plugin is anything from class definition to a lib built on top of a bunch of classes, a simple function helper or an asset or even a collection of assets, and more...

There are three types of plugins in **Shovel apps CMS**:

* Plugins that work for backend only.
* Plugins that work for client only.
* Plugins that work for both backend and client.

## Plugins for backend only

Server side plugins are also called node modules since all backend at **Shovel apps CMS** runs in [NodeJS](http://nodejs.org).

The minimum structure a module **must** have is:

* A `module-name` folder inside `/plugins` directory.
* An `index.js` file within `module-name`.
* A `module.exports` clause inside `index.js` file _exporting_ a `function()`.
* An `package.json` file within `module-name` describing the module as any **NodeJS** module does.

Examples are:

* [auth](https://github.com/DemocraciaEnRed/app/tree/development/lib/auth)
* [build](https://github.com/DemocraciaEnRed/app/tree/development/lib/build)
* [db-api](https://github.com/DemocraciaEnRed/app/tree/development/lib/db-api)

## plugins for client only

Client side plugins are developed with [plugin](http://github.com/plugin/plugin). Their structure is explained in the provided source [wiki](http://github.com/plugin/plugin/wiki/Spec).

The minimum structure a plugin **must** have is:

* A `plugin-name` folder inside `/lib` directory.
* A `plugin.json` within `plugin-name` with keys: `name`, `description`, `dependencies` (if any), `local` dependencies (if any), `scripts`, and `main`.
* An `index.js` file within `plugin-name` listed in `scripts` and added as `main` too in `plugin.json`.

The best, simpler and complete way to do the above is installing [plugin(1)](http://github.com/plugin/plugin#Install) and running

```
$ cd lib
$ plugin create plugin-name
$ cd plugin-name
$ ls
    .gitignore
    History.md
    Makefile
    Readme.md
    plugin.json
    index.js
```

Which will also create `.gitignore`, `Makefile`, and `History.md` files.

Examples are:

* [proposal-article](https://github.com/democraciaenred/app/tree/development/lib/proposal-article)
* [proposal-options](https://github.com/democraciaenred/app/tree/development/lib/proposal-article)
* [proposal-comments](https://github.com/democraciaenred/app/tree/development/lib/proposal-article)

## plugins for both server and client

The use of plugins for both the client and server meet the only requirement of having an `index.js` in combination of a descriptor file `plugin.json` naming as its main script the same `index.js` used on the server. The key with this type of plugins is to have common code written once and shared without restrictions.

Examples of this are:

* [regexps](https://github.com/DemocraciaEnRed/app/tree/development/lib/regexps)