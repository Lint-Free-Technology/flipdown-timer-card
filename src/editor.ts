import { LitElement, html, TemplateResult, css } from 'lit';
import { HomeAssistant, fireEvent, LovelaceCardEditor } from 'custom-card-helpers';

import { FlipdownTimerCardConfig } from './types';
import { customElement, property, state } from 'lit/decorators.js';

const configSchema = [
  {
    name: 'entity',
    label: 'Entity',
    selector: {
      entity: {
        domain: ['timer', 'input_datetime', 'sensor'],
      },
    },
  },
  {
    name: 'name',
    label: 'Name',
    selector: { entity_name: {} },
    context: { entity: 'entity' },
  },
  {
    name: 'duration',
    label: 'Timer duration indicated when idle',
    selector: { duration: {} },
  },
  {
    type: 'grid',
    schema: [
      {
        name: 'show_title',
        label: 'Show card title',
        selector: { boolean: {} },
      },
      {
        name: 'show_header',
        label: 'Show rotor headings',
        selector: { boolean: {} },
      },
      {
        name: 'show_hour',
        label: 'Show hour rotors',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'true', label: 'Show' },
              { value: 'false', label: 'Hide' },
              { value: 'auto', label: 'Auto' },
            ],
          },
        },
      },
      {
        name: 'theme',
        label: 'Theme',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'hass', label: 'Hass' },
              { value: 'dark', label: 'Dark' },
              { value: 'light', label: 'Light' },
            ],
          },
        },
      },
    ],
  },
];

const rotorStyleSchema = [
  {
    type: 'expandable',
    label: 'Rotor style',
    icon: 'mdi:flip-vertical',
    schema: [
      {
        type: 'grid',
        schema: [
          {
            name: 'width',
            label: 'Rotor width',
            selector: { text: {} },
          },
          {
            name: 'height',
            label: 'Rotor height',
            selector: { text: {} },
          },
          {
            name: 'space',
            label: 'Space between rotors',
            selector: { text: {} },
          },
          {
            name: 'fontsize',
            label: 'Rotor font size',
            selector: { text: {} },
          },
        ],
      },
    ],
  },
];

const buttonStyleSchema = [
  {
    type: 'expandable',
    label: 'Button style',
    icon: 'mdi:button-pointer',
    schema: [
      {
        type: 'grid',
        schema: [
          {
            name: 'width',
            label: 'Button width',
            selector: { text: {} },
          },
          {
            name: 'height',
            label: 'Button height',
            selector: { text: {} },
          },
          {
            name: 'fontsize',
            label: 'Button font size',
            selector: { text: {} },
          },
          {
            name: 'location',
            label: 'Location',
            selector: {
              select: {
                mode: 'dropdown',
                options: [
                  { value: 'right', label: 'Right' },
                  { value: 'bottom', label: 'Bottom' },
                  { value: 'hide', label: 'Hide' },
                ],
              },
            },
          },
        ],
      },
    ],
  },
];

const localizeSchema = [
  {
    type: 'expandable',
    label: 'Localize',
    icon: 'mdi:translate',
    schema: [
      {
        name: 'button',
        selector: { text: {} },
      },
      {
        name: 'header',
        selector: { text: {} },
      },
    ],
  },
];

@customElement('flipdown-timer-card-editor')
export class FlipdownTimerCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: FlipdownTimerCardConfig;

  public setConfig(config: FlipdownTimerCardConfig): void {
    this._config = config;
    let configUpgraded: boolean = false;

    // Upgrade duration from string to object if needed
    if (typeof this._config.duration === 'string') {
      const [hours, minutes, seconds] = (this._config.duration as string).split(':').map(Number);
      this._config.duration = { hours, minutes, seconds };
      configUpgraded = true;
    }

    if (configUpgraded) {
      fireEvent(this, 'config-changed', { config: this._config });
    }
  }

  private _configChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const config = ev.detail.value;

    this._config = config as FlipdownTimerCardConfig;
    fireEvent(this, 'config-changed', { config });
  }

  private _rotorStyleConfigChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;
    const config = ev.detail.value;
    const rotorStyle = { rotor: config };
    const styles = this._config.styles || {};
    this._config.styles = { ...styles, ...rotorStyle };
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _buttonStyleConfigChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;
    const config = ev.detail.value;
    const buttonStyle = { button: config };
    const styles = this._config.styles || {};
    this._config.styles = { ...styles, ...buttonStyle };
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _localizeConfigChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;
    const config = ev.detail.value;
    const localize = { localize: config };
    this._config = { ...this._config, ...localize };
    fireEvent(this, 'config-changed', { config: this._config });
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._config) {
      return html``;
    }

    return html`
      <div class="form-editor">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${configSchema}
          .computeLabel=${(s) => s.label ?? s.name}
          @value-changed=${this._configChanged}
        ></ha-form>
      </div>
      <div class="form-editor">
        <ha-form
          .hass=${this.hass}
          .data=${this._config.styles?.rotor ?? {}}
          .schema=${rotorStyleSchema}
          .computeLabel=${(s) => s.label ?? s.name}
          @value-changed=${this._rotorStyleConfigChanged}
        ></ha-form>
      </div>
      <div class="form-editor">
        <ha-form
          .hass=${this.hass}
          .data=${this._config.styles?.button ?? {}}
          .schema=${buttonStyleSchema}
          .computeLabel=${(s) => s.label ?? s.name}
          @value-changed=${this._buttonStyleConfigChanged}
        ></ha-form>
      </div>
      <div class="form-editor">
        <ha-form
          .hass=${this.hass}
          .data=${this._config.localize ?? {}}
          .schema=${localizeSchema}
          .computeLabel=${(s) => s.label ?? s.name}
          @value-changed=${this._localizeConfigChanged}
        ></ha-form>
      </div>
    `;
  }

  static get styles() {
    return css`
      .form-editor {
        margin-bottom: 16px;
      }
    `;
  }
}
