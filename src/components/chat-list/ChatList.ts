import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "./ChatSection";
import "./ChatSectionItem";
import { ChatSystem } from "../../ChatSystem";
import type { IChatSession } from "../../models/Chat";
import { autorun } from "mobx";
import { ChatStore } from "../../store/ChatStore";

@customElement('chat-list')
export class ChatList extends LitElement {

  @state() selectedId?: string; 

  @property({ type: Array }) sessions: IChatSession[] = [];
  
  connectedCallback() {
    super.connectedCallback();
    autorun(() => {
      this.selectedId = ChatStore.chatID.get();
    });
  }

  render() {
    return html`
      <div class="header">
        <input type="text" placeholder="Search" />
        <button>NEW +</button>
      </div>
      <div class="body">
        ${this.renderSections()}
      </div>
      <div class="footer">
        <button>Setting</button>
      </div>
    `;
  }

  private renderSections() {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneYear = 365 * oneDay;

    const sections: Record<string, IChatSession[]> = {
      'Today': [], 'Yesterday': [], 'Last Week': [],
      'Last Year': [], 'Over a Year Ago': []
    };

    this.sessions.forEach(chat => {
      const chatDate = new Date(chat.createdOn);
      const diff = now.getTime() - chatDate.getTime();

      if (diff < oneDay) {
        sections['Today'].push(chat);
      } else if (diff < 2 * oneDay) {
        sections['Yesterday'].push(chat);
      } else if (diff < oneWeek) {
        sections['Last Week'].push(chat);
      } else if (diff < oneYear) {
        sections['Last Year'].push(chat);
      } else {
        sections['Over a Year Ago'].push(chat);
      }
    });

    return Object.entries(sections).map(([label, items]) => {
      if (items.length === 0) return nothing;
      return html`
        <chat-section .label=${label}>
          ${this.renderSectionItems(items)}
        </chat-section>
      `;
    });
  }

  private renderSectionItems(items: IChatSession[]) {
    return items.map((item) => {
      const selected = this.selectedId === item.id;
      return html`
        <chat-section-item
          ?selected=${selected}
          .item=${item}
          @click=${() => this.loadChat(item)}
        ></chat-section-item>
      `;
    });
  }

  private async loadChat(session: IChatSession) {
    await ChatSystem.loadChat(session);
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
      box-sizing: border-box;

      border: 1px solid black;
    }

    .body {
      position: relative;
      width: 100%;
      height: calc(100% - (var(--header-height) + var(--footer-height)));
      overflow-x: hidden;
      overflow-y: auto;
      box-sizing: border-box;

      border: 1px solid black;
    }

    .footer {
      position: relative;
      width: 100%;
      height: var(--footer-height);
      box-sizing: border-box;

      border: 1px solid black;
    }
  `;
}