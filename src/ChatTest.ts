import { LitElement, css, html } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { autorun } from "mobx";
import { marked } from 'marked';
import { ChatSystem } from './ChatSystem';
import { ChatStore } from "./store/ChatStore";

@customElement('chat-test')
export class ChatTest extends LitElement {

  @query('textarea') input!: HTMLTextAreaElement;
  @query('.output') output!: HTMLDivElement;
  @state() ready: boolean = false;
  @state() status: string = '';
  @state() chatID: string = '';

  connectedCallback() {
    super.connectedCallback();
    autorun(() => {
      this.chatID = ChatStore.chatID.get();
    });
    autorun(() => {
      this.status = ChatStore.status.get();
    });
    autorun(async () => {
      const message = ChatStore.message.get();
      const html = await marked.parse(message);
      this.output.innerHTML = html;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  protected async firstUpdated(_changedProperties: any) {
    super.firstUpdated(_changedProperties);
    await this.updateComplete;
  }

  protected async updated(_changedProperties: any) {
    super.updated(_changedProperties);
    await this.updateComplete;
  }

  render() {
    return html`
      <div class="divider">테스트</div>
      <div class="button">
        <!-- <button @click=${this.getInfo}>정보 조회</button>
        <button @click=${this.getAuthConfig}>인증 조회</button>
        <button @click=${this.getChats}>모든세션 조회</button>
        <button @click=${this.createChat}>새로운세션 생성</button>
        <button @click=${this.join}>세션 합류</button>
        <button @click=${this.getChat}>특정세션 조회</button>
        <button @click=${this.editChat}>특정세션 수정</button>
        <button @click=${this.deleteChat}>특정세션 삭제</button>
        <button @click=${this.getMessages}>특정세션 메시지 조회</button>
        <button @click=${this.getChatDocument}>특정세션 문서 조회</button>
        <button @click=${this.getChatArchive}>특정세션 아카이브 조회</button>
        <button @click=${this.getChatMemory}>특정세션 메모리 조회</button>
        <button @click=${this.getChatParticipants}>특정세션 참가자 조회</button> -->
      </div>

      <div class="divider">상태</div>
      <div class="status">
        <p>Chat ID: ${this.chatID}</p>
        <p>Status: ${this.status}</p>
      </div>

      <div class="divider">출력</div>
      <div class="output"></div>

      <div class="divider">입력</div>
      <div class="input">
        <textarea
          ?disabled=${!this.ready}
          @keydown=${this.handleKeydown}
        ></textarea>
        <button @click=${this.sendMessage}>3. Send</button>
      </div>
    `;
  }

  // private async getInfo() {
  //   await ChatSystem.getInfo();
  // }
  // private async getAuthConfig() {
  //   await ChatSystem.getAuthConfig();
  // }

  // private async createChat() {
  //   await ChatSystem.createChat();
  // }

  // private async getChats() {
  //   const json = await ChatSystem.getAllChats();
  //   const id = json[0].id;
  //   ChatStore.chatID.set(id);
  // }

  // private async getChat() {
  //   await ChatSystem.getChat();
  // }

  // private async editChat() {
  //   await ChatSystem.editChat();
  // }

  // private async deleteChat() {
  //   await ChatSystem.deleteChat();
  // }

  // private async getMessages() {
  //   await ChatSystem.getMessages();
  // }

  // private async getChatArchive() {
  //   await ChatSystem.getArchive();
  // }

  // private async getChatDocument() {
  //   await ChatSystem.getDocument();
  // }

  // private async getChatMemory() {
  //   await ChatSystem.getMemories();
  // }

  // private async getChatParticipants() {
  //   await ChatSystem.getParticipants();
  // }

  // private async join() {
  //   if(this.chatID) {
  //     ChatSystem.joinChat();
  //     this.ready = true;
  //   } else {
  //     window.alert('You need to select a chat first');
  //   }
  // }

  private async sendMessage() {
    const value = this.input.value;
    if(this.ready) {
      this.input.value = '';
      await ChatSystem.sendMessage(value);
    } else {
      window.alert('You need to join a chat first');
    }
  }

  private async handleKeydown(event: KeyboardEvent) {
    if(event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 20px;
    }

    .divider {
      border-bottom: 1px solid gray;
      margin-top: 10px;
    }

    .status {
      font-size: 0.8em;
    }

    .output {
      border: 1px solid gray;
      padding: 10px;
      min-height: 200px;
      overflow-y: auto;
    }

    .input {
      display: flex;
      gap: 10px;
      height: 100px;

      textarea {
        width: 90%;
      }
      button {
        width: 10%;
      }
    }
  `;
}