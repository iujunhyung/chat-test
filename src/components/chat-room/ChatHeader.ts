import { LitElement, css, html } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { autorun } from "mobx";
import { ChatStore } from "../../system/ChatStore";

@customElement('chat-header')
export class ChatHeader extends LitElement {

  @query('.title') titleEl!: HTMLSpanElement;

  @state() label: string = "Chat Room";
  @state() description?: string;
  @state() memoryBalance?: number;

  connectedCallback() {
    super.connectedCallback();

    autorun(() => {
      this.label = ChatStore.title.get();
      this.description = ChatStore.description.get();
      this.memoryBalance = ChatStore.memoryBalance.get();
    });
  }

  render() {
    return html`
      <div class="prefix">
        <slot name="prefix"></slot>
      </div>
      <div class="center">
        <span class="title">${this.label}</span>
        <button>Edit</button>
      </div>
      <div class="suffix">
        <slot name="suffix"></slot>
      </div>
    `;
  }

  static styles = css`
    :host {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 5px;
      padding: 0 20px;
      box-sizing: border-box;
    }

    .prefix {
      display: block;
    }

    .center {
      position: relative;
      
      .title {
        max-width: 260px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .suffix {
      display: block;
    }
  `;
}