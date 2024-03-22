import { LitElement, css, html, nothing } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { autorun } from "mobx";

import type { IChatSession } from "../../models/Chat";
import { ChatSystem, ChatStore } from "../../system";

@customElement('chat-sidebar')
export class ChatSidebar extends LitElement {

  @query('.toggler') toggler!: HTMLDivElement;

  @state() label: string = "Copilot";
  @state() selectedId?: string; 
  @state() chats: IChatSession[] = [];
  @state() search: string = '';
  
  protected async firstUpdated(changedProperties: any) {
    super.firstUpdated(changedProperties);
    await this.updateComplete;

    autorun(() => {
      this.chats = ChatStore.chats.get();
    });
    autorun(() => {
      this.selectedId = ChatStore.chatID.get();
    });
    autorun(() => {
      const screen = ChatSystem.screen.get();
      this.toggler.style.display = screen === 'small' ? 'inline-flex' : 'none';
    });
  }

  render() {
    return html`
      <!-- Side Bar Head -->
      <div class="header">
        <div class="control">
          <chat-icon-button class="toggler" name="list"
            @click=${() => ChatSystem.openSidebar.set(false)}
          ></chat-icon-button>
          <span class="title">${this.label}</span>
          <div class="flex"></div>
          <chat-icon-button name="plus-square"
            tooltip="Create New"
            @click=${this.createChat}
          ></chat-icon-button>
          <chat-icon-button name="trash"
            tooltip="Delete All"
            @click=${this.deleteAllChat}
          ></chat-icon-button>
        </div>
        <div class="search">
          <chat-icon name="search"></chat-icon>
          <input type="text" placeholder="Search" 
            @keydown=${this.searchChat}/>
        </div>
      </div>

      <!-- Side Bar Session List -->
      <div class="body">
        ${this.renderSections()}
      </div>

      <!-- Side Bar Setting Button -->
      <div class="footer">
        <chat-side-button @click=${() => ChatSystem.toggleTheme()}>
          <chat-icon slot="prefix" name="gear"></chat-icon>
          <chat-icon slot="suffix" name="export"></chat-icon>
          System Setting
        </chat-side-button>
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
          @select=${() => ChatSystem.openSidebar.set(false)}
        ></chat-section-item>
      `;
    });
  }

  private async createChat() {
    const newChat = await ChatSystem.createChat();
    this.chats = [newChat.chatSession, ...this.chats];
    await ChatSystem.loadChat(newChat.chatSession);
  }

  private async deleteAllChat(event: MouseEvent) {
    const target = event.target as any;
    if(target.loading) return;
    target.loading = true;
    await ChatSystem.deleteAllChats();
    target.loading = false;
  }

  private async searchChat(event: KeyboardEvent) {
    if(event.key === 'Enter') {
      const target = event.target as HTMLInputElement;
      this.search = target.value.toLocaleLowerCase();
    }
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

  static styles = css`
    :host {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      background-color: var(--sl-color-gray-50);

      --header-height: 90px;
      --footer-height: 60px;
      --header-padding: 12px;
      --footer-padding: 12px;
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

      .control {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 10px;

        .title {
          font-size: 20px;
          line-height: 24px;
          font-weight: 600;
        }

        .flex {
          flex: 1;
        }
      }

      .search {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
        padding: 5px 10px;
        box-sizing: border-box;
        border-radius: 5px;
        border: 1px solid var(--sl-color-neutral-600);
          
        input {
          flex: 1;
          border: none;
          outline: none;
          background-color: transparent;
          font-size: 14px;
          line-height: 14px;
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
    }
    .body::-webkit-scrollbar {
      width: 0px;
    }

    .footer {
      position: relative;
      width: 100%;
      height: var(--footer-height);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--footer-padding);
      box-sizing: border-box;
    }
  `;
}