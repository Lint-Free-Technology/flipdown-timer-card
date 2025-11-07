import { LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'flipdown-timer-card-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}
export interface FlipdownTimerCardConfig extends LovelaceCardConfig {
  type: string;
  name?: string;
  entity: string;
  duration?: {
    hours?: number;
    minutes?: number;
    seconds?: number;
  };
  show_title?: boolean;
  show_header?: boolean;
  show_hour?: boolean | 'auto';
  theme?: 'hass' | 'dark' | 'light';
  styles?: {
    rotor?: {
      height?: number;
      width?: number;
      space?: number;
      fontsize?: string;
    };
    button?: {
      width?: number;
      height?: number;
      fontsize?: string;
      location?: 'right' | 'left' | 'hide';
    };
  };
}
