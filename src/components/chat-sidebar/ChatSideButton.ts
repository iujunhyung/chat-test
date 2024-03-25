import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement('chat-side-button')
export class ChatSideButton extends LitElement {
  
  render() {
    return html`
      <div class="container">
        <slot name="prefix"></slot>
        <slot></slot>
        <slot name="suffix"></slot>
      </div>
    `;
  }

  static styles = css`
    :host {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 10px 15px;
      box-sizing: border-box;
      border-radius: 5px;
      cursor: pointer;
    }
    :host(:hover) {
      background: var(--sl-color-gray-300);
      /* color: var(--sl-color-neutral-0); */
    }
    :host(:active) {
      background: var(--sl-color-gray-400);
      /* color: var(--sl-color-neutral-0); */
    }

    .container {
      position: relative;
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      font-weight: 500;
      line-height: 20px;
      gap: 15px;
    }
  `;
}