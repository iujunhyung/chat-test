import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

type ButtonTheme = 'primary' | 'default';

@customElement('chat-button')
export class ChatButton extends LitElement {
  
  @property({ type: Boolean, reflect: true }) loading: boolean = false;
  @property({ type: String, reflect: true }) theme: ButtonTheme = 'primary';
  @property({ type: String }) tooltip?: string;

  render() {
    return this.tooltip
      ? this.renderButtonWithTooltip()
      : this.renderButton();
  }

  private renderButtonWithTooltip() {
    return html`
      <chat-tooltip
        position="bottom"
        .content=${this.tooltip}
      >
        ${this.renderButton()}
      </chat-tooltip>
    `;
  }

  private renderButton() {
    return html`
      <div class="container">
        <slot name="prefix"></slot>
        <slot></slot>
        <slot name="suffix"></slot>
      </div>
      <loading-spinner class="overlay" size="14px"
      ></loading-spinner>
    `;
  }
  
  static styles = css`
    :host {
      display: inline-flex;
      font-size: 14px;
      line-height: 18px;
      font-weight: 500;
      cursor: pointer;
      box-sizing: border-box;
      border: 1px solid;
      border-radius: 5px;
      transition: background-color 0.15s ease-in-out;

      --theme-color: var(--sl-color-primary-600);
    }

    :host([loading]) {
      pointer-events: none;
      cursor: progress;
    }
    :host([loading]) .overlay {
      display: flex;
    }

    /* 기본값(primary 테마) */
    :host([theme='primary']) {
      --theme-color: var(--sl-color-primary-600);
      background-color: var(--sl-color-primary-600);
      border-color: var(--sl-color-primary-600);
      color: var(--sl-color-neutral-0);
    }
    :host([theme='primary']:hover) {
      background-color: var(--sl-color-primary-500);
      border-color: var(--sl-color-primary-500);
      color: var(--sl-color-neutral-0);
    }
    :host([theme='primary']:active) {
      background-color: var(--sl-color-primary-600);
      border-color: var(--sl-color-primary-600);
      color: var(--sl-color-neutral-0);
    }

    /* default 테마 */
    :host([theme='default']) {
      --theme-color: var(--sl-color-neutral-700);
      background-color: var(--sl-color-neutral-0);
      border-color: var(--sl-color-neutral-300);
      color: var(--sl-color-neutral-700);
    }
    :host([theme='default']:hover) {
      background-color: var(--sl-color-primary-50);
      border-color: var(--sl-color-primary-300);
      color: var(--sl-color-primary-700);
    }
    :host([theme='default']:active) {
      background-color: var(--sl-color-primary-100);
      border-color: var(--sl-color-primary-400);
      color: var(--sl-color-primary-700);
    }

    .container {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 5px 10px;
      box-sizing: border-box;
    }

    .overlay {
      position: absolute;
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 3;
      width: 100%;
      height: 100%;
      background-color: var(--theme-color);
    }

  `;
}