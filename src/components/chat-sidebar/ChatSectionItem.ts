import { LitElement, css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import type { IChatSession } from "../../models/Chat";
import { ChatSystem } from "../../system/ChatSystem";

@customElement('chat-section-item')
export class ChatSectionItem extends LitElement {

  @query('.control') control!: HTMLDivElement;
  @state() openControl: boolean = false;

  @property({ type: Object }) item?: IChatSession;
  @property({ type: Boolean }) selected: boolean = false;

  render() {
    return html`
      <!-- Menu Item -->
      <div class="item"
        @click=${() => this.loadChat()}>
        ${this.item?.title}
      </div>
      <!-- Dropdown Menu Control -->
      <chat-popup class="control" ?open=${this.openControl} position="bottom-left" distance="5px">
        <!-- Dropdown Trigger -->
        <chat-icon-button name="vertical-dots" size="20"
          @click=${this.toggleDropdown}
        ></chat-icon-button>

        <!-- Dropdown Menu -->
        <div class="menu" slot="content">
          <div class="item" @click=${() => this.deleteChat()}>
            <chat-icon name="trash"></chat-icon>
            Delete
          </div>

        </div>
      </chat-popup>
    `;
  }

  private async loadChat() {
    if (!this.item) return;
    await ChatSystem.loadChat(this.item);
    this.dispatchEvent(new CustomEvent('select'));
  }

  private async deleteChat() {
    this.openControl = false;
    if (!this.item?.id) return;
    await ChatSystem.deleteChat(this.item.id);
  }

  private toggleDropdown = () => {
    this.openControl = !this.openControl;
    if (this.openControl) {
      window.addEventListener('click', this.handleOutsideClick);
    } else {
      window.removeEventListener('click', this.handleOutsideClick);
    }
  }

  private handleOutsideClick = (event: MouseEvent) => {
    if (this.openControl) {
      const path = event.composedPath();
      if (!path.includes(this.control)) {
        this.openControl = false;
      }
    }
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
      padding: 10px 15px;
    }
    :host(:hover) {
      background-color: var(--sl-color-gray-100);
    }
    :host(:hover) .control {
      display: block;
      background-color: var(--sl-color-gray-100);
    }
    :host([selected]) {
      background-color: var(--sl-color-gray-200);
    }
    :host([selected]) .control {
      display: block;
      background-color: var(--sl-color-gray-200);
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
      cursor: pointer;
    }

    .control {
      position: absolute;
      display: none;
      z-index: 3;
      right: 10px;
      top: 8px;

      .menu {
        position: relative;
        z-index: 4;
        display: flex;
        flex-direction: column;
        border: 1px solid var(--sl-color-neutral-300);
        background-color: var(--sl-color-neutral-0);

        .item {
          position: relative;
          width: 100px;
          height: 30px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          gap: 7px;
          font-size: 14px;
          line-height: 20px;
          font-weight: 400;
          padding: 10px 10px;
          box-sizing: border-box;
          cursor: pointer;
        }
        .item:hover {
          background-color: var(--sl-color-gray-100);
        }
      }
    }
  `;
}