# shovelapps-bootstrap

Style common to all Shovel apps products.
Used in the following repositories as a submodule:

* https://github.com/shovelapps/shovelapps-cms
* https://github.com/shovelapps/shovelapps.org
* https://github.com/shovelapps/shovelapps.com
* https://github.com/shovelapps/pato

# Usage
## Using this repo as another repo submodule 

```
$ cd /main-repo-path/
$ git submodule add https://github.com/shovelapps/shovelapps-bootstrap submodule-rootpath/shovelapps-bootstrap
Cloning into 'submodule-path/shovelapps-bootstrap'...
remote: Counting objects: 49, done.
remote: Compressing objects: 100% (23/23), done.
remote: Total 49 (delta 8), reused 0 (delta 0), pack-reused 26
Unpacking objects: 100% (49/49), done.
```

Plase, make sure you RTFM:
http://git-scm.com/book/en/v2/Git-Tools-Submodules

## Updating main repos

When a change is made in the sovelapps-bootstrap repo, in order to reflect it in the main repos that has it as a submodule you should do:

```
$ cd /main-repo-path/submodule-path/
$ git pull origin master
$ cd /main-repo-path/
$ git commit -am 'Updated submodule pointer'
```

## Using it in a Node.JS app

It is a good idea to update your apps package.json file, with "postinstall" instructions.
```
  [...]
  scripts": {
    "postinstall": "git submodule init && git submodule update",
    "start": "node app.js"
  },
  [...]
```
