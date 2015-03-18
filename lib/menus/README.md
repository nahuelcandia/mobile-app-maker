# Menu manager

Handles menu entries on the CMS sidebar.

## API

Once required, the menu manager attaches itself to:

`app.cms.menus = require('lib/menus')(app)`


#### registerAdminMenu(menuItem, *[clean]*)

Adds an entry to the admin sidebar menu.

`menuItem` *{Object}*: item configuration object

  * `menuItem.title` *{String}*: Menu item title, this will be used as link text
  * `menuItem.href` *{String}*: URI where the item links
  * `menuItem.icon` *{String}*: ion-icon icon class for this entry
  * `menuItem.weight` *{Int}*: for sort purposes, lighter goes up, heavier goes down. Takes the heaviest weight + 1 by default.

`clean` *{Boolean}*: optional, whether the supplied object should be trimmed to only the needed properties for the menu entry (title, href, icon & weight)

**Use case**

```javascript
app.cms.menus.registerAdminMenu({
  title: "App screens",
  href: "/admin/screens",
  icon: "ion-monitor",
  weight: app.cms.menus.lightestAdminMenuItem() - 1
});
```

#### registerAdminGroupMenu(headerItem, items) 

Adds a group entry to the admin sidebar menu. A group can hold any number of items. Items should be provided as described in **registerAdminMenu**

`headerItem` *{Object}*: header item configuration object

  * `headerItem.title` *{String}*: Group title, will be used in the dropdown menu generated for the group
  * `headerItem.description` *{String}*: short description for the group
  * `headerItem.icon` *{String}*: ion-icon icon class for the group dropdown
  * `headerItem.weight` *{Int}*: for sort purposes, lighter goes up, heavier goes down. Takes the heaviest weight + 1 by default.

`items` *{Array}*: an array of items as described in **registerAdminMenu**

**Use case**

```javascript
app.cms.menus.registerAdminGroupMenu({
    title: 'Plugins',
    description: 'Manage current plugins or add a new one',
    icon: 'ion-code-working'
  },[
    {
      title: 'Manage plugins',
      href: '/admin/plugins',
      icon: 'ion-code'
    },{
      title: 'Add plugin',
      href: '/admin/plugins'
    }
  ]
);
```

#### sortAdminMenuItems

Sorts the admin menu array based on items.weight property. Lightest goes up.

#### heaviestAdminMenuItem

Returns {Int} with the heaviest weighted menu item

#### lightestAdminMenuItem

Returns {Int} with the lightest weighted menu item