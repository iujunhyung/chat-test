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

  @state() messages: IChatMessage[] = [];

  connectedCallback() {
    super.connectedCallback();
    autorun(() => {
      this.messages = ChatStore.history.get();
    });
  }

  render() {
    return html`
      <div class="output">
        ${this.messages.map((message) => html`
          <chat-message .value=${message}></chat-message>
        `)}
      </div>
      <div class="input">
        <chat-input></chat-input>
      </div>
    `;
  }

  static styles = css`
    :host {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      
      box-sizing: border-box;
      border: 1px solid black;
    }

    .output {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow-x: hidden;
      overflow-y: auto;
      box-sizing: border-box;
      padding: 10px;

      border: 1px solid black;
    }

    .input {
      position: relative;
      width: 100%;
      box-sizing: border-box;
      padding: 10px;

      border: 1px solid black;
    }
  `;
}