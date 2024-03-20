import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { IChatSession } from "../../models/Chat";
import { ChatSystem } from "../../system/ChatSystem";

@customElement('chat-section-item')
export class ChatSectionItem extends LitElement {

  @property({ type: Object }) item?: IChatSession;
  @property({ type: Boolean }) selected: boolean = false;

  render() {
    return html`
      <div class="item"
        @click=${() => this.loadChat()}>
        ${this.item?.title}
      </div>
      <div class="button">
        <button @click=${this.deleteChat}>버튼</button>
      </div>
    `;
  }

  private async loadChat() {
    if (!this.item) return;
    await ChatSystem.loadChat(this.item);
  }

  private async deleteChat() {
    if (!this.item?.id) return;
    await ChatSystem.deleteChat(this.item.id);
  }

  static styles = css`
    :host {
      position: relative;
      width: 100%;
      height: 36px;
      display: flex;
      flex-direction: row;
      align-items: center;
      box-sizing: border-box;
      border-radius: 5px;
    }
    :host(:hover) {
      background-color: var(--sl-color-gray-100);
    }
    :host(:hover) .button {
      display: block;
    }
    :host([selected]) {
      background-color: var(--sl-color-gray-200);
      .button {
        display: block;
      }
    }

    .item {
      position: relative;
      width: 100%;
      height: 20px;
      display: block;
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0px 5px;
      cursor: pointer;
    }

    .button {
      position: absolute;
      z-index: 2;
      display: none;
      right: 0;
      top: 0;
      width: 40px;
      height: 100%;
    }
  `;
}