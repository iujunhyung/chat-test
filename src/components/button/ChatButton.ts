import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('chat-button')
export class ChatButton extends LitElement {
  
  @property({ type: Boolean, reflect: true }) outline: boolean = false;

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
      display: inline-flex;
      font-size: 14px;
      line-height: 14px;
      font-weight: 500;
      color: var(--sl-color-neutral-600);
      cursor: pointer;
      border-radius: 5px;
    }
    :host(:hover) {
      background-color: rgba(0, 0, 0, 0.1);
    }
    :host([outline]) {
      background-color: transparent;
      border: 1px solid rgba(0, 0, 0, 0.3);
    }

    .container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 5px 10px;
      border-radius: 5px;
      box-sizing: border-box;
    }
  `;
}