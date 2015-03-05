#Shovel apps CMS 
### **Open Source mobile App Maker**.
[http://shovelapps.org](http://shovelapps.org)


**Shovel apps CMS** is a mobile oriented CMS that lets you create
mobile apps editing the content of your app in a CMS fashion.

In Web Content Management Systems, the purpose of the system is to allow you
to focus on the content and the final frontend is rendered by the browser.

**Shovel apps CMS** makes it easy for you to create an Hybrid App starting from 
HTML templates and editing the content by yourself without the nagging of having to install
an entire Phonegap environment for yourself.

When you're done editing your app's contents, you  can **create Android binaries
 with one click and test it right away in your device.**

###tl;dr.

**Shovel apps CMS** is a CMS that compiles itself to a mobile binary

##Download

[Latest version](https://github.com/shovelapps/shovelapps-cms/releases/latest)


## Installation

###Requirements 

You need [NodeJS](http://nodejs.org/download/) installed to run **Shovel apps CMS**. 

* Download the latest version in this directory.

```
$ wget https://github.com/shovelapps/shovelapps-cms/archive/latest.zip
$ cd ~/shovelapps-cms
```
* Unzip it, install dependencies and run it.
```
$ unzip latest.zip
$ cd shovelapps-cms-latest/
$ npm install
$ ./start.sh
```



## Run and open your browser

```
$ cd shovelapps-cms-latest/
$ ./start.sh
```

Open your browser in `http://localhost:3000`


### CMS Configuration

All config is loaded from the `config/default.json` once the CMS is installed.


##Issues

[Report your issues with Shovel apps CMS here](http://github.com/shovelapps/shovelapps-cms/issues).

##Libraries used

* jQuery
* socket.io
* FastClick
* medium-editor
 * MediumButton


#License 

The MIT License (MIT)

Copyright (c) 2014, 2015 Shovel apps, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
