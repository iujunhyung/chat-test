import { LitElement, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";

import "./ChatSection";
import "./ChatSectionItem";
import { ChatSystem } from "../../ChatSystem";
import type { IChatSession } from "../../models/Chat";

@customElement('chat-list')
export class ChatList extends LitElement {

  @state() chats: IChatSession[] = [];

  connectedCallback() {
    super.connectedCallback();
    this.getAllChats();
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
      '오늘': [],
      '어제': [],
      '일주일 전': [],
      '일 년 전': [],
      '그 이전': []
    };

    this.chats.forEach(chat => {
      const chatDate = new Date(chat.createdOn);
      const diff = now.getTime() - chatDate.getTime();

      if (diff < oneDay) {
        sections['오늘'].push(chat);
      } else if (diff < 2 * oneDay) {
        sections['어제'].push(chat);
      } else if (diff < oneWeek) {
        sections['일주일 전'].push(chat);
      } else if (diff < oneYear) {
        sections['일 년 전'].push(chat);
      } else {
        sections['그 이전'].push(chat);
      }
    });

    return Object.entries(sections).map(([date, items]) => {
      if (items.length === 0) return nothing;
      return html`
        <chat-section .label=${date}>
          ${this.renderSectionItems(items)}
        </chat-section>
      `;
    });
  }

  private renderSectionItems(items: IChatSession[]) {
    return items.map((item) => {
      return html`
        <chat-section-item
          .item=${item}
          @click=${() => this.loadChat(item)}
        ></chat-section-item>
      `;
    });
  }

  private async loadChat(session: IChatSession) {
    await ChatSystem.loadChat(session);
  }

  private async getAllChats() {
    const chats = await ChatSystem.getAllChats();
    if(chats && chats.length > 0) {
      this.chats = chats;
    } else {
      await ChatSystem.createChat();
      this.getAllChats();
    }
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