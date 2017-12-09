### **Open Source mobile App Maker**.


Web CMS that lets you create
mobile apps for Android and iOS  with full control over the UI/UX as well functionality of each platform.
From this Web CMS and App Maker, you are also able to update the contents of your app in realtime, creating production-ready binaries, and also publishing to AppStore and Google Play from a single place.

##Download

## Installation

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/nahuelcandia/mobile-app-maker/tree/master)

Or install it and launch it on your sever:

###Requirements 

You need [NodeJS](http://nodejs.org/download/) installed to run **Shovel apps CMS**. 

* Download the latest version in this directory.

```
$ wget https://github.com/nahuelcandia/mobile-app-maker/archive/latest.zip
$ cd ~/mobile-app-maker
```
* Unzip it, install dependencies and run it.
```
$ unzip latest.zip
$ cd mobile-app-maker
$ npm install
$ ./start.sh
```


## Run and open your browser

```
$ cd mobile-app-maker-latest/
$ ./start.sh
```

Open your browser in `http://localhost:3000`


### CMS Configuration

All config is loaded from the `config/default.json` once the CMS is installed.


##Issues

[Report your issues here](https://github.com/nahuelcandia/mobile-app-maker/issues).

##Libraries used

* jQuery
* socket.io
* FastClick
* ace-editor
* medium-editor
 * MediumButton


#License 

The MIT License (MIT)

This software consists of voluntary contributions made by many
individuals. For exact contribution history, see the revision history
available at https://github.com/nahuelcandia/mobile-app-maker

The following license applies to all parts of this software except as
documented below:

====

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

====

All files located in the node_modules and external directories are
externally maintained libraries used by this software which have their
own licenses; we recommend you read them, as their terms may differ from
the terms above.
