import { LitElement, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { autorun } from "mobx";

import type { IChatSession } from "../../models/Chat";

import "./ChatSection";
import "./ChatSectionItem";
import { ChatSystem, ChatStore } from "../../system";

@customElement('chat-list')
export class ChatList extends LitElement {

  @state() label: string = "Copilot";
  @state() selectedId?: string; 
  @state() chats: IChatSession[] = [];
  @state() search: string = '';
  
  connectedCallback() {
    super.connectedCallback();
    this.getAllChats();
    autorun(() => {
      this.selectedId = ChatStore.chatID.get();
    });
  }

  render() {
    return html`
      <div class="header">
        <div class="control">
          <span class="title">${this.label}</span>
          <div class="flex"></div>
          <button @click=${this.createChat}>NEW +</button>
          <button>Delete All</button>
        </div>
        <div class="search">
          <input type="text" placeholder="Search" 
            @keydown=${this.searchChat}/>
        </div>
      </div>
      <div class="body">
        ${this.renderSections()}
      </div>
      <div class="footer">
        <button @click=${this.toggleTheme}>Global Setting</button>
      </div>
    `;
  }

  private renderSections() {
    const sections = this.filterChats();
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
        ></chat-section-item>
      `;
    });
  }

  private async getAllChats() {
    const chats = await ChatSystem.getAllChats();
    if(chats && chats.length > 0) {
      this.chats = chats;
      await ChatSystem.loadChat(chats[0]);
    } else {
      await ChatSystem.createChat();
      await this.getAllChats();
    }
  }

  private async createChat() {
    const newChat = await ChatSystem.createChat();
    this.chats = [newChat.chatSession, ...this.chats];
    await ChatSystem.loadChat(newChat.chatSession);
  }

  private filterChats() {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneYear = 365 * oneDay;

    const sections: Record<string, IChatSession[]> = {
      'Today': [], 'Yesterday': [], 'Last Week': [],
      'Last Year': [], 'Over a Year Ago': []
    };

    this.chats.forEach(chat => {
      const title = chat.title.toLocaleLowerCase();
      if(!title.includes(this.search)) return;
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

    return sections;
  }

  private async searchChat(event: KeyboardEvent) {
    if(event.key === 'Enter') {
      const target = event.target as HTMLInputElement;
      this.search = target.value.toLocaleLowerCase();
    }
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
      overflow: hidden;

      --header-height: 90px;
      --footer-height: 40px;
      --header-padding: 12px;
      --footer-padding: 12px;

      box-sizing: border-box;
      border: 1px solid black;
    }

    .header {
      position: relative;
      width: 100%;
      height: var(--header-height);
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-sizing: border-box;
      padding: var(--header-padding);

      border: 1px solid black;

      .control {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 5px;

        .title {
          font-size: 20px;
          line-height: 24px;
          font-weight: 600;
        }

        .flex {
          flex: 1;
        }

        button {
        }
      }

      .search {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 5px;
        box-sizing: border-box;
        border-radius: 5px;
        border: 1px solid black;
          
        input {
          flex: 1;
          border: none;
          outline: none;
          background-color: transparent;
        }
      }
    }

    .body {
      position: relative;
      width: 100%;
      height: calc(100% - (var(--header-height) + var(--footer-height)));
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow-y: auto;
      box-sizing: border-box;

      border: 1px solid black;

      &::-webkit-scrollbar {
        width: 0px;
      }
    }

    .footer {
      position: relative;
      width: 100%;
      height: var(--footer-height);
      box-sizing: border-box;
      padding: var(--footer-padding);

      border: 1px solid black;
    }
  `;
}