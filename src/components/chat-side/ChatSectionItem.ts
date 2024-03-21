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
      <!-- Menu Item -->
      <div class="item"
        @click=${() => this.loadChat()}>
        ${this.item?.title}
      </div>
      <!-- Munu Item Control -->
      <div class="control">
        <chat-icon-button name="vertical-dots" size="20"
          @click=${this.deleteChat}
        ></chat-icon-button>
      </div>
    `;
  }

  private async loadChat() {
    if (!this.item) return;
    await ChatSystem.loadChat(this.item);
    this.dispatchEvent(new CustomEvent('select'));
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
    :host(:hover) .control {
      display: block;
    }
    :host([selected]) {
      background-color: var(--sl-color-gray-200);
    }
    :host([selected]) .control {
      display: block;
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

    .control {
      position: absolute;
      display: none;
      z-index: 1;
      right: 5px;
      top: 7px;
    }
  `;
}