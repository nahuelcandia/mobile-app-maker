## Templates

Templates are the base for an app. You can create templates using differente rendering
engines.

An hybrid app should respect the mobile OSs
standards and this task is difficult to achieve from pure HTML and having to rely
on multiple tools and iterations in order for the app to have a design consistent
with the mobile's OS look & feel.

### Templates directory

Templates are installed under the /templates directory. Inside, there's one directory
for each template for the CMS

    shovelapps-cms
    └── templates
        ├── admin
        └── bootstrap-3-jade

## Render engines and file extensions.




### How to make a template

Templates are written in the [Jade](http://jade-lang.com/) language. 
*Jade allows you to write HTML code that is not bogus in terms of orphan tags.*

1. Create a directory  called `mytemplate` under the `templates` dir.
1. Start from an `index.jade`. Put all of your page there. For example,
download a responsive template from some bootstrap  theme providers for example. **Tip:** *If you want to try with your own HTML, convert it to JADE with [HTML to Jade converter](http://html2jade.aaron-powell.com/)*.
1. Create an assets directory under `templates/mytemplate`. **All files in assets will be available at the `assets/` URL in your apps frontend**.

### Recommendations about assets and libraries for your app

* Load phonegap.js
* Load cordova.js
* Recommend loading jQuery
* Recommend loading FastClick
* Plugins and templates are written in jade
* Jade offers tidiness to other developers and designers. When the user or 
  another developers will 
  rarely find basic nesting issues with HTML tags that often cause misalignments.


#### About paths in template files

* Use relative paths in the templates in order to keep consistent with 
the final structure that the app will have inside phonegap


####Variables available to templates (locals)

* `config.app`
* `isPreviewing`
* `session`