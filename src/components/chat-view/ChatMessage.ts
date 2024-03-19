import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { IChatMessage } from "../../models/Chat";

@customElement('chat-message')
export class ChatMessage extends LitElement {

  @property({ type: Object }) value?: IChatMessage;

  render() {
    return html`
      <div class="avatar">
        <img src="${this.value?.authorRole}" alt="avatar" />
      </div>
      <div class="content">
        <div class="header">
          <span class="name">${this.value?.userName}</span>
          <span class="time">${this.value?.timestamp}</span>
        </div>
        <div class="body">
          <p>${this.value?.content}</p>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      margin: 10px 0;
    }
  `;
}