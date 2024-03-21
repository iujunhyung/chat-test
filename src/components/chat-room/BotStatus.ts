import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('bot-status')
export class BotStatus extends LitElement {
  
  @property({ type: String }) message?: string;

  render() {
    if(this.message) {
      return html`
        <div class="container">
          <loading-spinner size="14px"></loading-spinner>
          <div class="message">${this.message}</div>
        </div>
      `;
    } else {
      return nothing;
    }
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .container {
      position: relative;
      width: auto;
      max-width: 100%;
      height: 24px;
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
      padding: 5px 10px;
      box-sizing: border-box;
      border-radius: 5px;
      background: var(--sl-color-neutral-100);
    }

    .message {
      font-size: 12px;
      line-height: 14px;
      font-weight: 400;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `;
}