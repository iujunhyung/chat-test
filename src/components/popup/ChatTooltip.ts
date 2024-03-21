import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { Position }from './ChatPopup';

@customElement('chat-tooltip')
export class ChatTooltip extends LitElement {
  
  @state() open: boolean = false;

  @property({ type: String }) position: Position = 'bottom';
  @property({ type: String }) content?: string;

  render() {
    return html`
      <chat-popup
        position=${this.position}
        ?open=${this.open}
        distance="10px"
      >
        <slot
          @mouseenter=${() => this.open = true}
          @mouseleave=${() => this.open = false}
        ></slot>
        ${this.renderTooltip()}
      </chat-popup>
    `;
  }

  private renderTooltip() {
    if (!this.content) return;
    return html`
      <div slot="content" class="tooltip">
        ${this.content}
      </div>
    `;
  }
  
  static styles = css`
    :host {
      display: inline-flex;
      position: relative;
    }
    .tooltip {
      background:  rgba(51,51,51,.9);
      color: #fff;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 14px;
      line-height: 18px;
    }
  `;
}