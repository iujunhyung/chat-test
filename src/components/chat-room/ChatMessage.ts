import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { marked } from "marked";

import { 
  type IChatMessage,
  ChatMessageType,
  AuthorRoles 
} from "../../models/Chat";

type SenderRole = 'bot' | 'user' | 'participant' | 'unknown';

@customElement('chat-message')
export class ChatMessage extends LitElement {

  @state() role: SenderRole = 'unknown';
  @state() user?: string;
  @state() time?: string;
  @state() content?: string;

  @property({ type: Object }) value?: IChatMessage;

  protected async updated(_changedProperties: any) {
    super.updated(_changedProperties);
    await this.updateComplete;

    if(_changedProperties.has('value') && this.value) {
      const { authorRole, timestamp, userName, type, content } = this.value;
      this.user = userName;
      this.role = this.parseRole(authorRole);
      this.time = this.parseTime(timestamp);
      this.content = await this.parseContent(type, content);
    }
  }

  render() {
    return html`
      <div class="prefix">
        <img class="avatar" src=${this.role} alt="avatar" />
        <label class="name">${this.user}</label>
      </div>
      <div class="main">
        <div class="content">
          ${unsafeHTML(this.content)}
        </div>
        <div class="footer">
          <div class="button">Copy</div>
          <label class="time">${this.time}</label>
        </div>
      </div>
    `;
  }

  private async parseContent(type: ChatMessageType, content: string) {
    if(type === ChatMessageType.Message) {
      const result = await marked.parse(content);
      return result;
    } else if(type === ChatMessageType.Document) {
      return undefined;
    } else if(type === ChatMessageType.Plan) {
      return undefined;
    } else {
      return undefined;
    }
  }

  private parseTime(timestamp?: number) {
    if(timestamp) {
      const date = new Date(timestamp);
      const result = date.toLocaleTimeString('en-US', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      return result;
    } else {
      return 'unknown';
    }
  }

  private parseRole(role?: AuthorRoles): SenderRole {
    if(role === AuthorRoles.Bot) {
      return 'bot';
    } else if(role === AuthorRoles.User) {
      return 'user';
    } else if(role === AuthorRoles.Participant) {
      return 'participant';
    } else {
      return 'unknown';
    }
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 20px;
    }

    .prefix {
      display: flex;
      flex-direction: column;
      align-items: center;

      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: red;
      }

      .name {
        font-size: 12px;
        font-weight: bold;
        line-height: 18px;
      }
    }

    .main {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .content {
        font-size: 14px;
        line-height: 20px;
        border-radius: 8px;
        padding: 10px;
        background-color: #f8f9fa;
        border: 1px solid #f8f9fa;
      }

      .footer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .button {
          font-size: 12px;
          line-height: 18px;
          color: #007bff;
          cursor: pointer;
        }

        .time {
          font-size: 12px;
          line-height: 18px;
          color: #6c757d;
        }
      }
    }
  `;
}