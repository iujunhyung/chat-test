import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { marked } from "marked";

import { 
  ChatMessageType,
  AuthorRoles 
} from "../../models/Chat";
import { ChatStore } from "../../system";

@customElement('chat-message')
export class ChatMessage extends LitElement {

  @state() innerTimestamp: string = 'unknown';
  @state() innerContent?: string;

  @property({ type: String }) messageId?: string;
  @property({ type: Number }) type?: ChatMessageType;
  @property({ type: Number }) authorRole?: AuthorRoles;
  @property({ type: String }) userName?: string;
  @property({ type: Number }) timestamp?: number;
  @property({ type: String }) content?: string;

  disconnectedCallback() {
    super.disconnectedCallback();
    if(this.messageId) {
      ChatStore.elements.delete(this.messageId);
    }
  }

  protected async firstUpdated(changedProperties: any) {
    super.firstUpdated(changedProperties);
    await this.updateComplete;
    if(this.messageId && this.authorRole === AuthorRoles.Bot) {
      ChatStore.elements.set(this.messageId, this);
    }
  }

  protected async updated(changedProperties: any) {
    super.updated(changedProperties);
    await this.updateComplete;

    if(changedProperties.has('timestamp') && this.timestamp) {
      this.innerTimestamp = this.parseTimestamp(this.timestamp);
    }
    if(changedProperties.has('content') && this.content
      && this.type !== undefined && this.type !== null) {
      this.innerContent = await this.parseContent(this.type, this.content);
    }
    this.dispatchEvent(new CustomEvent('render'));
  }

  render() {
    return html`
      <div class="avatar">
        ${this.renderAvatar()}
      </div>
      <div class="main">
        <div class="header">
          <label class="name">${this.userName}</label>
        </div>
        <div class="content">
          ${unsafeHTML(this.innerContent)}
        </div>
        <div class="footer">
          <div class="button">Copy</div>
          <label class="time">${this.innerTimestamp}</label>
        </div>
      </div>
    `;
  }

  private renderAvatar() {
    const avatar = this.authorRole === AuthorRoles.Bot 
    ? 'bot' 
    : this.authorRole === AuthorRoles.User
    ? 'user'
    : this.authorRole === AuthorRoles.Participant
    ? 'participant'
    : 'unknown';
    
    return html`
      <img src=${avatar} alt="avatar">
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

  private parseTimestamp(timestamp: number) {
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

  static styles = css`
    :host {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 20px;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: red;
      overflow: hidden;
    }

    .main {
      width: calc(100% - 40px);
      display: flex;
      flex-direction: column;
      gap: 10px;

      .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .name {
          font-size: 12px;
          font-weight: bold;
          line-height: 18px;
        }
      }

      .content {
        font-size: 14px;
        line-height: 20px;
        border-radius: 8px;
        padding: 10px;
        background-color: var(--sl-color-gray-50);
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