import { PropertyValues } from 'lit';

export interface HassEntityBase {
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
  entity_id: string;
  context: { id: string; user_id: string | null };
}

export interface HomeAssistant {
  states: Record<string, HassEntityBase>;
  callService(domain: string, service: string, serviceData?: Record<string, any>): Promise<void>;
  [key: string]: any;
}

export interface LovelaceCardConfig {
  index?: number;
  view_index?: number;
  type: string;
  [key: string]: any;
}

export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  isPanel?: boolean;
  editMode?: boolean;
  getCardSize(): number | Promise<number>;
  setConfig(config: LovelaceCardConfig): void;
}

export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: LovelaceCardConfig): void;
}

// Check if config or entity changed
export function hasConfigOrEntityChanged(element: any, changedProps: PropertyValues, forceUpdate: boolean): boolean {
  if (changedProps.has('config') || forceUpdate) {
    return true;
  }

  if (element.config?.entity) {
    const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
    if (oldHass) {
      return oldHass.states[element.config.entity] !== element.hass?.states[element.config.entity];
    }
    return true;
  }

  return false;
}

// Dispatches a custom event with an optional detail value.
export const fireEvent = (
  node: HTMLElement | Window,
  type: string,
  detail?: unknown,
  options?: {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
  },
): CustomEvent => {
  const opts = options || {};
  const event = new CustomEvent(type, {
    bubbles: opts.bubbles === undefined ? true : opts.bubbles,
    cancelable: Boolean(opts.cancelable),
    composed: opts.composed === undefined ? true : opts.composed,
    detail: detail === null || detail === undefined ? {} : detail,
  });
  node.dispatchEvent(event);
  return event;
};
