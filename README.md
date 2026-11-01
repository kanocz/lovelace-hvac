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

The card fits the width of its dashboard column. On cards up to 360px wide,
the operating state moves above the airflow diagram to leave room for the readings.
The diagram is an inline SVG: it stays sharp as the card resizes and does not
need a separate image file or depend on the installation directory name.
Click or tap any temperature, fan RPM, or airflow reading to open that sensor's
standard Home Assistant more-info dialog, including its history when recorded.
Click or tap the operating state (for example, **Comfort**) to open the standard
dialog for the configured mode selector and choose another mode.
Both the readings and operating state support Tab, Enter, and Space.

After updating, refresh the browser or Companion App frontend cache to load the
new JavaScript. No card configuration changes are needed.

## Entity configuration

In **Edit dashboard → Edit card**, use the visual editor's entity selectors to
choose your sensors and mode controls. The card uses Home Assistant's built-in
form editor (`getConfigForm`). Each field shows its original entity ID as a
default hint. Existing cards keep working without any configuration changes;
omitting or clearing a field restores that default.

The same options are available in the YAML editor. For example:

```yaml
type: custom:hvac-card
outdoor_temperature: sensor.ventilation_outdoor_temperature
exhaust_temperature: sensor.ventilation_exhaust_temperature
extract_temperature: sensor.ventilation_extract_temperature
supply_temperature: sensor.ventilation_supply_temperature
supply_fan_rpm: sensor.ventilation_supply_fan_rpm
extract_fan_rpm: sensor.ventilation_extract_fan_rpm
extract_air_flow: sensor.ventilation_extract_air_flow
supply_air_flow: sensor.ventilation_supply_air_flow
system_state: sensor.ventilation_state
system_mode: select.ventilation_mode
filter_days_left: sensor.ventilation_filter_days_left
bypass_position: sensor.ventilation_bypass_position
preheater_output: sensor.ventilation_preheater_output
winter_summer_mode: select.ventilation_season
```

`system_state` supplies the heading text; clicking it opens `system_mode`.
Mode controls can also use `input_select` helpers. History dialogs always open
the entity configured for the corresponding reading. Missing sensors show `—`;
missing controls are disabled and missing status indicators are inactive.
If the reported state sensor is missing, the heading shows the mode selector's state.

Sensor meanings and display units stay the same: temperatures in °C, fan speeds
in RPM, air flows in m³/h, filter life in days, and bypass position in percent.
The existing indicator rules also remain: filter warning below 10 days, bypass
at 100%, preheater active above zero, and mode names `Standby`, `Building protection`,
`Economy`, `Comfort`, `Summer` / `Winter`. Other operating modes use a generic fan icon.

## Browser checks

Serve the repository with a static HTTP server and open
[tests/hvac-card.html](tests/hvac-card.html). It checks the inline SVG without PNG requests,
entity events across shadow roots, live updates, and layout at widths from 280 to 800px using stub Home Assistant
card/icon elements. It also checks all entity mappings, the visual editor schema,
configuration validation, default compatibility, and missing entities. It uses the
same Lit CDN import as the card, so internet access is required. The native visual
editor, actual more-info dialog, and recorded history need a Home Assistant instance
to verify.
