# Homeassistant Lovelace HVAC card

It's a fork from https://github.com/wichers/lovelace-comfoair to use with other ventilation unit.

Use https://github.com/kanocz/modbus2mqtt to connect your ventilation unit to Homeassistant and then use this lovelace card to visualize your data!

![Image](https://raw.githubusercontent.com/kanocz/lovelace-hvac/master/result.png)

# Installation

* Clone this repo into your `www` folder inside your configuration. So it will be: `config_folder/www/lovelace-hvac`. 
* Edit your lovelace-ui.yaml or use the flat configuration mode in lovelace and add to the top:
```
resources:
  - type: module
    url: /local/lovelace-hvac/hvac-card.js
```
* Add a card with `type: 'custom:hvac-card'` to your UI.
* Reload home assistant
* ???
* Profit!

