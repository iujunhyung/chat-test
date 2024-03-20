import { LitElement, css, html } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import type { 
  IChatMessage 
} from "../../models/Chat";

import "./ChatMessage";
import "./ChatInput";
import { autorun } from "mobx";
import { ChatStore } from "../../system/ChatStore";

@customElement('chat-room')
export class ChatRoom extends LitElement {

  private readonly observer = new ResizeObserver(() => {
    console.log('resize');
    this.scrollToBottom();
  });

  @query('.output') output!: HTMLDivElement;
  @state() messages: IChatMessage[] = [];

  connectedCallback() {
    super.connectedCallback();
    autorun(() => {
      this.messages = ChatStore.messages.get();
    });
  }

  disconnectedCallback() {
    this.observer.disconnect();
    super.disconnectedCallback();
  }

  protected async firstUpdated(changedProperties: any) {
    super.firstUpdated(changedProperties);
    await this.updateComplete;
    this.observer.observe(this.output);
  }

  render() {
    return html`
      <div class="output">
        ${this.messages.map((message) => html`
          <chat-message
            .messageId=${message.id}
            .type=${message.type}
            .authorRole=${message.authorRole}
            .userName=${message.userName}
            .timestamp=${message.timestamp}
            .content=${message.content}
          ></chat-message>
        `)}
      </div>
      <div class="input">
        <chat-input></chat-input>
      </div>
    `;
  }

  private scrollToBottom = async () => {
    this.output.scrollTo({
      top: this.output.scrollHeight,
      behavior: 'instant'
    })
  }

  static styles = css`
    :host {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      
      box-sizing: border-box;
      border: 1px solid black;

      --column-width: 768px;
      --side-padding: 20px;
    }

    .output {
      position: relative;
      width: var(--column-width);
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow-x: hidden;
      overflow-y: auto;
      box-sizing: border-box;
      padding: 30px var(--side-padding);

      border: 1px solid black;
    }

    .input {
      position: relative;
      width: var(--column-width);
      box-sizing: border-box;
      padding: 10px var(--side-padding);

      border: 1px solid black;
    }
  `;
}