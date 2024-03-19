import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";

import './chat-list/ChatList';
import './chat-room/ChatRoom';

import type { IChatSession } from "../models/Chat";
import { ChatSystem } from "../ChatSystem";
import { autorun } from "mobx";
import { ChatStore } from "../store/ChatStore";

@customElement('multiple-chat')
export class MultipleChat extends LitElement {

  @state() label: string = "Chat Room";
  @state() sessions: IChatSession[] = [];

  connectedCallback() {
    super.connectedCallback();
    this.getAllSession();

    autorun(() => {
      this.label = ChatStore.title.get();
    });
  }

  render() {
    return html`
      <div class="panel">
        <chat-list
          .sessions=${this.sessions}
        ></chat-list>
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

  private async getAllSession() {
    const sessions = await ChatSystem.getAllChats();
    if(sessions && sessions.length > 0) {
      this.sessions = sessions;
      await ChatSystem.loadChat(sessions[0]);
    } else {
      await ChatSystem.createChat();
      await this.getAllSession();
    }
  }

  private async toggleTheme() {
    document.documentElement.classList.toggle("sl-theme-dark");
  }

  static styles = css`
    :host {
      container-name: chat-container;
      container-type: inline-size;
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
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
        height: 50px;
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
        height: calc(100% - 50px);
      }
    }

    @container chat-container (max-width: 768px) {
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
  `;
}