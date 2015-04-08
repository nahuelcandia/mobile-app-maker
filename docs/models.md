# Data Models to Jade files

## Structure
	/url/page
		- structure
		|- of
		|- data


## Models

###/admin/screens 
	- categorie
	|- name 
	|- screens: screen
	|- id 

	- screen
	|- id 
	|- imgpreview 
	|- title 
	|- content 
	|- subcategorie

**Example:**

	{
		"categories": [
			{
				"name": "Places",
				"id": 1,
				"screens": [
					{
						"id": "screen-852",
						"imgpreview": "screen-852.png",
						"title": "Hotel Tucuman",
						"content": " HTML or other model",
						"subcategorie": "Splash" 
					}
				]
			},
			{
				"name": "Other Places",
				"id": 2,
				"screens": []
			}
		]
	}


/screens/edit/:id
	- screen
	|- id 
	|- imgpreview 
	|- title 
	|- content 
	|- options: options 


	- options
	|- position 
	|- showinmenu


	Example:

		{
			"id": "screen-852",
			"imgpreview": "screen-852.png",
			"title": "Hotel Tucuman",
			"content": " HTML",
			"options": {
				"position": 1,
				"showinmenu": true
			}   
		}   


/admin/menues
	- place
	|- id
	|- title
	|- menues: menu

	- menu
	|- id
	|- title
	|- linked: linked
	|- publish

	- linked
	|- parent
	|- linkedto

	Example:

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


/admin/themes or /admin/templates
	- theme
	|- id
	|- title
	|- osname
	|- imgpreview

	Example:

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

/admin/plugins
	- plugin
	|- id
	|- title
	|- imgpreview
	|- enable
	|- support: support

	- support
	|- os
	|- devices

	Example:

		{
			"plugins": [
				{
					"id": "plugin-1",
					"title": "Facebook Comments",
					"imgpreview": "comments.png",
					"enable": true,
					"support": {
						"os": ["android", "ios"],
						"devices": ["phone", "tablet"]
					}
				},
				{
					"id": "plugin-2",
					"title": "Chat",
					"imgpreview": "preview.png",
					"enable": false,
					"support": {
						"os": ["ios"],
						"devices": ["phone", "tablet"]
					}
				}
			]
		}



/admin/* (all pages)
	- app
	|- id
	|- name
	|- imgpreview

	- navigate
	|- thispage

	Example:

		{
			"app": {
				"id": "app-1",
				"name": "Elmeme",
				"imgpreview": "elmeme1-1.png",
			},
			"navigate": {
				"thispage": "/admin/screens"
			},
			"categories": [...] /* All normal data model /admin/screens */
		}