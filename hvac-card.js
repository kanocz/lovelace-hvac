import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

console.log(`%chvac-card\n%cVersion: ${'0.1.0'}`, 'color: #1976d2; font-weight: bold;', '');

class HVACCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {}
    };
  }

  render() {
    return html`
    <ha-card style="width: 400px">
    <div class="container">
      <div class="bg">
          <div class="flex-container">
              <div class="flex-col-out">
                  <div>${this.hass.states['sensor.recuperace_outdoor_air_temperature'].state}°C</div>
                  <div class="fan-state"><ha-icon icon="mdi:speedometer"></ha-icon></ha-icon> ${Math.trunc(this.hass.states['sensor.recuperace_supply_fan_spreed_rpm'].state)} rpm</div>
                  <div>${this.hass.states['sensor.recuperace_exhaust_air_temperature'].state}°C</div>
                  <div class="fan-state"><ha-icon icon="mdi:speedometer"></ha-icon> ${Math.trunc(this.hass.states['sensor.recuperace_extract_fan_spreed_rpm'].state)} rpm</div>
              </div>
              <div class="flex-col-main">
                  <div>${this.hass.states['sensor.recuperace_current_system_state'].state}</div>
                  <div><ha-icon class="spin" icon="mdi:${({'Standby': 'fan-off', 'Building protection': 'fan-speed-1', 'Economy': 'fan-speed-2', 'Comfort': 'fan-speed-3'}[this.hass.states['select.recuperace_current_system_mode'].state])}"></ha-icon></div>
              </div>
              <div class="flex-col-in">
                  <div style="align-self: end">${this.hass.states['sensor.recuperace_extract_air_temperature'].state}°C</div>
                  <div class="fan-state"><ha-icon icon="mdi:fan"></ha-icon> ${Math.trunc(this.hass.states['sensor.recuperace_current_extract_air_flow_m3_h'].state)}m³/h</div>
                  <div style="align-self: end">${this.hass.states['sensor.recuperace_supply_air_temperature'].state}°C</div>
                  <div class="fan-state"><ha-icon icon="mdi:fan"></ha-icon> ${Math.trunc(this.hass.states['sensor.recuperace_current_supply_air_flow_m3_h'].state)}m³/h</div>
              </div>
          </div>
      </div>
      </div>
      <div class="info-row">
      ${this.getFanTmpl()}
      ${this.getAirFilterTmpl()}
      ${this.getBypassTmpl()}
      ${this.getPreHeatTmpl()}
      ${this.getSummerModeTmpl()}
      </div>
    </ha-card>
    `;
  }

  getFanTmpl(){
    if(this.hass.states['select.recuperace_current_system_mode'].state != 'Standby'){
      return html`<ha-icon icon="mdi:fan"></ha-icon>`;
    }else{
      return html`<ha-icon class="inactive" icon="mdi:fan"></ha-icon>`;
    }
  }

  getAirFilterTmpl(){
    if(this.hass.states['sensor.recuperace_filters_timer_days_left'].state < 10){
      return html`<ha-icon class="warning" icon="mdi:air-filter"></ha-icon>`;
    }else{
      return html`<ha-icon class="inactive" icon="mdi:air-filter"></ha-icon>`;
    }
  }

  getBypassTmpl(){
    if(this.hass.states['sensor.recuperace_bypass_position'].state == 100){
      return html`<ha-icon icon="mdi:shuffle-disabled"></ha-icon>`;
    }else{
      return html`<ha-icon class="inactive" icon="mdi:shuffle-variant"></ha-icon>`;
    }
  }

  getPreHeatTmpl(){
    if(this.hass.states['sensor.recuperace_preater_control_output'].state > 0){
      return html`<ha-icon icon="mdi:radiator"></ha-icon>`;
    }else{
      return html`<ha-icon class="inactive" icon="mdi:radiator"></ha-icon>`;
    }
  }

  getSummerModeTmpl(){
    if(this.hass.states['select.recuperace_winter_summer_mode'].state != 'Summer'){
      return html`<ha-icon icon="mdi:snowflake"></ha-icon>`;
    }else{
      return html`<ha-icon class="inactive" icon="mdi:weather-sunny"></ha-icon>`;
    }
  }

  setConfig(config) {
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 7;
  }

  static get styles() {
    return css`
    .container {
      padding: 10px;
    }
    .bg {
      background-image: url(/local/lovelace-havc/hvac_heat.png);
      height: 200px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position-y: center
    }
    .not-found {
    background-color: yellow;
    font-family: sans-serif;
    font-size: 14px;
    padding: 8px;
    }
    .flex-container {
        display: flex;
        justify-content: space-between;
        height: 100%;
    }
    .flex-col-main {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 30px 0px;
      font-size: x-large;
      text-align: center;
      font-weight:bold;
    }
    .flex-col-out {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .flex-col-in {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .fan-state {
      padding-top: 35px;
    }
    .spin {
      animation-name: spin;
      animation-duration: 2000ms;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }

    .info-row {
      background: rgba(0,0,0,0.2);
      margin-top: 10px;
      padding: 5px;
      border-top: rgba(0,0,0,0.4);
      -webkit-box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.75);
      -moz-box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.75);
      box-shadow: 0px -2.5px 3px rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: space-around;
    }

    .inactive {
      opacity: 0.7;
    }

    .warning {
      color: color: #d80707db;
    }

  @keyframes spin {
      from {
          transform:rotate(0deg);
      }
      to {
          transform:rotate(360deg);
      }
    }
    `;
  }
}
customElements.define("hvac-card", HVACCard);

const xe=window;
xe.customCards=xe.customCards||[],xe.customCards.push({type:'hvac-card',name:"HVAC Card",preview:!0,description:"HVAC Card"});
