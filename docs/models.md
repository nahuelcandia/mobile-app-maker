# Data Models to Jade files

## Structure
	/url/page/of/model
		─ modelStructure
		└─ var
		└─ nameOfVar: model

		─ model
		└─ other
		└─ model
		└─ var2
		└─ var3

## Models

###/admin/screens 
	─ categorie
	└─ name 
	└─ subcategories: subcategorie
	└─ id 

	─ subcategorie
	└─ id
	└─ name
	└─ screens: screen

	─ screen
	└─ id 
	└─ imgpreview 
	└─ title 
	└─ content 

**Example:**

	{
		"categories": [
			{
				"name": "Places",
				"id": 1,
				"subcategories": [
					{
						"name": "Splash",
						"id": 1,
						"screens": [
							{
								"id": "screen-852",
								"imgpreview": "screen-852.png",
								"title": "Hotel Tucuman",
								"content": " HTML or other model"
							},
							{
								"id": "screen-882",
								"imgpreview": "screen-852.png",
								"title": "Hotel Cordoba",
								"content": " HTML or other model"
							}
						]
					}
				]
			},
			{
				"name": "Other Places",
				"id": 2,
				"subcategories": []
			}
		]
	}


###/screens/edit/:id
	─ screen
	└─ id 
	└─ imgpreview 
	└─ title 
	└─ content
	└─ categorie: categorie
	└─ subcategorie: subcategorie

	─ categorie
	└─ name
	└─ id

	─ subcategorie
	└─ name
	└─ id



**Example:**

	{
		"id": "screen-852",
		"imgpreview": "screen-852.png",
		"title": "Hotel Tucuman",
		"content": " HTML",
		"categorie": {
			"name": "Places",
			"id": 1
		},
		"subcategorie": {
			"name": "Splash",
			"id": 1
		}
	}   


###/admin/menues
	─ place
	└─ id
	└─ title
	└─ menues: menu

	─ menu
	└─ id
	└─ title
	└─ linked: linked
	└─ icon: icon
	└─ position

	─ linked
	└─ name
	└─ id

	─ icon
	└─ name
	└─ id

**Example:**

	{
		"linkeds": [
			{
				"name": "Home",
				"id": 1
			},
			{
				"name": "Cars",
				"id": 2
			},
			{
				"name": "Home 2",
				"id": 3
			},
			{
				"name": "Home 3",
				"id": 4
			}
		],
		"icons": [
			{
				"name": "icon-cars",
				"id": 3
			},
			{
				"name": "icon-home",
				"id": 4
			},
			{
				"name": "icon-upload",
				"id": 5
			}
		],
		"places": [
			{
				"id": "place-1",
				"title": "Bottom app menu"
				"menues": [
					{
						"id": 1,
						"title": "Test menu",
						linked: {
							"name": "Home",
							"id": 1
						},
						"icon": {
							"name": "icon-cars",
							"id": 3
						},
						"position": 1
					},
					{
						"id": 2,
						"title": "Test menu 2",
						linked: {
							"name": "Cars",
							"id": 2
						},
						"icon": {
							"name": "icon-cars",
							"id": 3
						},
						"position": 1
					}
				]
			}
		]
	}


###/admin/categories
	─ categorie
	└─ id
	└─ name
	└─ parent: categorie
	└─ publish


**Example:**

	{
		"categories": [
			{
				"id": "category-1",
				"name": "Behaviors",
				"parent": null
			},
			{
				"id": "category-2",
				"name": "Content",
				"parent": null
			},
			{
				"id": "category-3",
				"name": "Post1",
				"parent": {
					"id": "category-2",
					"name": "Content"
				}
			}
		]
	}

###/admin/themes
	─ theme
	└─ id
	└─ title
	└─ osname
	└─ imgpreview

**Example:**

	{
		"themes": [
			{
				"id": "theme-1",
				"title": "Elmeme theme A",
				"osname": "iOS",
				"imgpreview": "preview.png"
			},
			{
				"id": "theme-2",
				"title": "Elmeme theme B",
				"osname": "Android",
				"imgpreview": "preview.png"
			}
		]
	}

###/admin/plugins
	─ plugin
	└─ id
	└─ title
	└─ imgpreview
	└─ enabled
	└─ support: support

	─ support
	└─ os
	└─ devices

**Example:**

	{
		"plugins": [
			{
				"id": "plugin-1",
				"title": "Facebook Comments",
				"imgpreview": "comments.png",
				"enabled": true,
				"support": {
					"os": ["android", "ios"],
					"devices": ["phone", "tablet"]
				}
			},
			{
				"id": "plugin-2",
				"title": "Chat",
				"imgpreview": "preview.png",
				"enabled": false,
				"support": {
					"os": ["ios"],
					"devices": ["phone", "tablet"]
				}
			}
		]
	}


###/admin/* (all pages)
	─ app
	└─ id
	└─ name
	└─ imgpreview

	─ navigate
	└─ actualpage

**Example:**

	{
		"app": {
			"id": "app-1",
			"name": "Elmeme",
			"imgpreview": "elmeme1-1.png",
		},
		"navigate": {
			"actualpage": "/admin/screens"
		},
		"categories": [...] /* All normal data model /admin/screens */
	}