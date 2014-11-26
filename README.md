README.md

##Requirements 

You need [NodeJS](http://nodejs.org/download/) installed. 



## Installation

Via Node Package Manager.

`$ npm install shovelapps-cms`


## Running

`$node server.js`


#Folder structure


```
├── config
│   └── default.json
├── filestorage
├── lib
├── plugins
├── server.js
├── sslcerts
│   ├── cert.pem
│   └── key.pem
├── start.sh
├── start.bat
├── templates
│   ├── admin
│   ├── bootstrap-3-jade
│   ├── jsconf-ar
│   └── ratchet-jade
└── README.md
```

### CMS Configuration

All config is loaded from the `config` directory using the [config](https://www.npmjs.org/package/config) module

### Storage

Users data, session data and screens data is stored locally in the filesystem.



## Templates

###About paths in templates

* User relative paths in the templates in order to keep consistent with the final structure that the app will have inside phonegap


### How to make a tamplte

1. Start from an index.jade. Put all of your page there. If you want to try with your own HTML, convert it to JADE with [HTML to Jade converter](http://html2jade.aaron-powell.com/).

## Debugging

Shovel apps CMS uses the `debug` module and debugs under the namespace `"cms*"`


### Notes

* Load phonegap.js
* Load cordova.js
* Recommend loading jQuery
* Recommend loading FastClick
* Plugins and templates are written in jade
* Jade offers tidinees to other developers and designers. When the user or another developers will 
  rarely find bas nesting issues with HTML tags that often cause misalignments.