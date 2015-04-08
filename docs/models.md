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
	└─ publish

	─ linked
	└─ parent
	└─ linkedto

**Example:**

	{
		"places": [
			{
				"id": "place-1",
				"title": "Bottom app menu"
				"menues": [
					{
						"id": 1,
						"title": "Test menu",
						"publish": true,
						linked: {
							"parent": "Screen",
							"kinkedto": "Cars"
						}
					}
				]
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