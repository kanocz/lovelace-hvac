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
    <ha-card>
    <div class="container">
      <div class="bg">
          <svg class="airflow-diagram" viewBox="0 0 840 268" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="air-temperature">
                <stop offset="0" stop-color="#adc6eb"></stop>
                <stop offset="1" stop-color="#ff797d"></stop>
              </linearGradient>
            </defs>
            <g fill="url(#air-temperature)" stroke="#424242" stroke-width="2">
              <path d="M1 4H169L679 206H839V266H669L158 63H1Z"></path>
              <path d="M1 206H158L669 4H839V63H679L169 266H1Z"></path>
            </g>
            <g fill="#fff">
              <path d="M23 26H61V17L76 34 61 51V42H23Z"></path>
              <path d="M803 26H765V17L750 34 765 51V42H803Z"></path>
              <path d="M76 220H38V211L23 228 38 245V236H76Z"></path>
              <path d="M750 220H788V211L803 228 788 245V236H750Z"></path>
            </g>
          </svg>
          <div class="flex-container">
              <div class="flex-col-out">
                  ${this.getReadingTmpl('sensor.recuperace_outdoor_air_temperature', '°C')}
                  <div class="fan-state">${this.getReadingTmpl('sensor.recuperace_supply_fan_spreed_rpm', ' rpm', 'mdi:speedometer')}</div>
                  ${this.getReadingTmpl('sensor.recuperace_exhaust_air_temperature', '°C')}
                  <div class="fan-state">${this.getReadingTmpl('sensor.recuperace_extract_fan_spreed_rpm', ' rpm', 'mdi:speedometer')}</div>
              </div>
              <div class="flex-col-main">
                  <button type="button" class="reading mode-state" aria-haspopup="dialog"
                    @click=${() => this.showMoreInfo('select.recuperace_current_system_mode')}>
                    ${this.hass.states['sensor.recuperace_current_system_state'].state}
                  </button>
                  <div><ha-icon class="spin" icon="mdi:${({'Standby': 'fan-off', 'Building protection': 'fan-speed-1', 'Economy': 'fan-speed-2', 'Comfort': 'fan-speed-3'}[this.hass.states['select.recuperace_current_system_mode'].state])}"></ha-icon></div>
              </div>
              <div class="flex-col-in">
                  ${this.getReadingTmpl('sensor.recuperace_extract_air_temperature', '°C')}
                  <div class="fan-state">${this.getReadingTmpl('sensor.recuperace_current_extract_air_flow_m3_h', 'm³/h', 'mdi:fan')}</div>
                  ${this.getReadingTmpl('sensor.recuperace_supply_air_temperature', '°C')}
                  <div class="fan-state">${this.getReadingTmpl('sensor.recuperace_current_supply_air_flow_m3_h', 'm³/h', 'mdi:fan')}</div>
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

  getReadingTmpl(entityId, unit, icon) {
    const entity = this.hass.states[entityId];
    const value = icon && Number.isFinite(Number(entity.state)) ? Math.trunc(entity.state) : entity.state;
    const name = entity.attributes.friendly_name || entityId;
    return html`
      <button type="button" class="reading" title="${name}" aria-label="${name}: ${value}${unit}"
        @click=${() => this.showMoreInfo(entityId)}>
        ${icon ? html`<ha-icon icon="${icon}"></ha-icon>` : ''}${value}${unit}
      </button>
    `;
  }

  showMoreInfo(entityId) {
    this.dispatchEvent(new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true
    }));
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
    :host {
      display: block;
      min-width: 0;
    }
    ha-card {
      width: 100%;
      box-sizing: border-box;
      container-type: inline-size;
    }
    .container {
      padding: 10px;
    }
    .bg {
      position: relative;
      height: 224px;
    }
    .airflow-diagram {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 120px;
      transform: translateY(-50%);
      pointer-events: none;
    }
    .not-found {
    background-color: yellow;
    font-family: sans-serif;
    font-size: 14px;
    padding: 8px;
    }
    .flex-container {
        position: relative;
        display: flex;
        justify-content: space-between;
        height: 100%;
    }
    .flex-col-main {
      position: absolute;
      inset: 30px 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      pointer-events: none;
      font-size: x-large;
      text-align: center;
      font-weight:bold;
    }
    .flex-col-out, .flex-col-in {
      display: grid;
      grid-template-rows: repeat(2, 44px 1fr);
      justify-items: start;
      min-width: 0;
    }
    .flex-col-in {
      justify-items: end;
    }
    .fan-state {
      align-self: end;
    }
    .reading {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      min-height: 44px;
      padding: 0;
      border: 0;
      border-radius: 4px;
      background: none;
      color: inherit;
      font: inherit;
      white-space: nowrap;
      cursor: pointer;
    }
    .reading:hover {
      background: rgba(127, 127, 127, 0.15);
    }
    .reading:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .mode-state {
      max-width: 45%;
      overflow-wrap: anywhere;
      white-space: normal;
      text-align: center;
      pointer-events: auto;
    }
    @container (max-width: 360px) {
      .container {
        padding-top: 54px;
      }
      .flex-col-main {
        top: -44px;
      }
      .mode-state {
        max-width: 100%;
        font-size: 20px;
      }
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
