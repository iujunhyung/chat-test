import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { autorun } from "mobx";

import './chat-list/ChatList';
import './chat-room/ChatRoom';
import { ChatStore } from "../system";

@customElement('multiple-chat')
export class MultipleChat extends LitElement {

  @state() label: string = "Chat Room";

  connectedCallback() {
    super.connectedCallback();
    autorun(() => {
      this.label = ChatStore.title.get();
    });
  }

  render() {
    return html`
      <div class="panel">
        <chat-list></chat-list>
      </div>
      <div class="main">
        <div class="header">
          <button>Menu</button>
          <label>${this.label}</label>
          <button>Settings</button>
          <button @click=${this.toggleTheme}>Theme</button>
        </div>
        <chat-room></chat-room>
      </div>
    `;
  }

  private async toggleTheme() {
    document.documentElement.classList.toggle("sl-theme-dark");
  }

  static styles = css`
    :host {
      container-name: multiple-chat;
      container-type: inline-size;
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;

      --header-height: 50px;
    }

    .panel {
      position: relative;
      width: 260px;
      height: 100%;
    }

    .main {
      position: relative;
      width: calc(100% - 260px);
      height: 100%;

      .header {
        position: relative;
        width: 100%;
        height: var(--header-height);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        box-sizing: border-box;
        padding: 0 10px;

        border: 1px solid black;
      }

      chat-room {
        position: relative;
        width: 100%;
        height: calc(100% - var(--header-height));
      }
    }

    @container multiple-chat (max-width: 768px) {
      .panel {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
      }

      .main {
        width: 100%;
      }
    }

    @container multiple-chat (max-width: 1100px) {
      .main {
        chat-room {
          --column-width: 100%;
        }
      }
    }
  `;
}