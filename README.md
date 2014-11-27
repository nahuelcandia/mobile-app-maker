README.md

##Requirements 

You need [NodeJS](http://nodejs.org/download/) installed. 



## Installation

Via Node Package Manager.

`$ npm install -g shovelapps-cms`


## Running

`$ shovelapps-cms`


#Folder structure


```
├── config
│   └── default.json
├── filestorage
├── lib
├── plugins
├── server.js
├── start.sh
├── start.bat
├── templates
│   ├── admin
│   ├── bootstrap-3-jade
└── README.md
```

### CMS Configuration

All config is loaded from the `config` directory using the [config](https://www.npmjs.org/package/config) module

### Storage

Users data, session data and screens data is stored locally in the filesystem.



## Templates

###About paths in templates

* Use relative paths in the templates in order to keep consistent with 
the final structure that the app will have inside phonegap


### How to make a template

Templates are written in the [Jade](http://jade-lang.com/) language. 
*Jade allows you to write HTML code that is not bogus in terms of orphan tags.*

1. Start from an `index.jade`. Put all of your page there. If you want to try with your own HTML, convert it to JADE with [HTML to Jade converter](http://html2jade.aaron-powell.com/).

## Debugging

Shovel apps CMS uses the `debug` module and debugs under the namespace `"cms*"`


### Recommendations

* Load phonegap.js
* Load cordova.js
* Recommend loading jQuery
* Recommend loading FastClick
* Plugins and templates are written in jade
* Jade offers tidinees to other developers and designers. When the user or 
  another developers will 
  rarely find basic nesting issues with HTML tags that often cause misalignments.