import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import type { 
  IChatMessage 
} from "../../models/Chat";

import "./ChatMessage";
import "./ChatInput";
import { autorun } from "mobx";
import { ChatStore } from "../../store/ChatStore";

@customElement('chat-room')
export class ChatRoom extends LitElement {

  @state() label: string = "Chat Room";
  @state() messages: IChatMessage[] = [];

  connectedCallback() {
    super.connectedCallback();
    autorun(() => {
      this.label = ChatStore.title.get();
    });
    autorun(() => {
      this.messages = ChatStore.history.get();
    });
  }

  render() {
    return html`
      <div class="header">
        <button>Menu</button>
        <h1>${this.label}</h1>
        <button>Settings</button>
        <button @click=${this.toggleTheme}>Theme</button>
      </div>
      <div class="body">
        ${this.messages.map((message) => html`
          <chat-message .value=${message}></chat-message>
        `)}
      </div>
      <div class="footer">
        <chat-input></chat-input>
      </div>
    `;
  }

  private async toggleTheme() {
    document.documentElement.classList.toggle("sl-theme-dark");
  }

  static styles = css`
    :host {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      
      --header-height: 50px;
      --footer-height: 50px;

      box-sizing: border-box;
      border: 1px solid black;
    }

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

    .body {
      position: relative;
      width: 100%;
      height: calc(100% - (var(--header-height) + var(--footer-height)));
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow-x: hidden;
      overflow-y: auto;
      box-sizing: border-box;
      padding: 10px;

      border: 1px solid black;
    }

    .footer {
      position: relative;
      width: 100%;
      height: var(--footer-height);
      box-sizing: border-box;
      padding: 10px;

      border: 1px solid black;

      chat-input {
        position: absolute;
        left: 0;
        bottom: 0;
        width: calc(100% - 20px);
      }
    }
  `;
}