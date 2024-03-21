import { LitElement, css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { autorun } from "mobx";

import { ChatSystem, ChatStore } from "../../system";

@customElement('chat-sender')
export class ChatSender extends LitElement {

  @query('textarea') input!: HTMLTextAreaElement;
  @state() status?: string;
  @property({ type: String }) value: string = '';

  protected async firstUpdated(changedProperties: any) {
    super.firstUpdated(changedProperties);
    await this.updateComplete;

    autorun(() => {
      this.status = ChatStore.status.get();
    });
  }

  protected async updated(changedProperties: any) {
    super.updated(changedProperties);
    await this.updateComplete;

    if(changedProperties.has('value')) {
      this.adjustHeight();
    }
  }

  render() {
    return html`
      <!-- Kernel Status Message -->
      <bot-status class="status"
        .message=${this.status}
      ></bot-status>

      <!-- File Uploader -->
      <chat-icon-button name="clip" size="22"
        @click=${this.uploadFile}
      ></chat-icon-button>
      
      <!-- User Input -->
      <textarea
        rows="1"
        @input=${this.handleInput}
        @keydown=${this.handleKeyDown}
      ></textarea>
      
      <!-- Send Button -->
      <chat-icon-button name='send' size="22"
        @click=${this.sendMessage}
      ></chat-icon-button>
    `;
  }

  private handleKeyDown = async (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      await this.sendMessage();
    }
  }

  private handleInput = async (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
  }

  private adjustHeight = async ()  => {
    if (!this.input) return;
    this.input.style.height = 'auto';
    this.input.style.height = `${this.input.scrollHeight}px`;
  }

  private async sendMessage() {
    const message = this.value;
    this.input.value = '';
    this.value = '';
    if(!message) return;
    await ChatSystem.sendMessage(message);
  }

  private async uploadFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*';
    input.addEventListener('change', this.handleFiles);
    input.click();
  }

  private handleFiles = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);
    if(file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const data = reader.result as string;
        console.log(data);
      }
      reader.readAsDataURL(file);
    }
    input.removeEventListener('change', this.handleFiles);
  }

  static styles = css`
    :host {
      position: relative;
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: row;
      gap: 10px;
      align-items: flex-end;
      box-sizing: border-box;
      padding: 10px 15px;
      border: 1px solid var(--sl-color-neutral-600);
      border-radius: 10px;
    }

    .status {
      position: absolute;
      top: -40px;
      left: 0px;
    }

    textarea {
      width: 100%;
      min-height: 24px;
      max-height: 200px;
      overflow-y: auto;
      -webkit-appearance: none;
      appearance: none;
      border: none;
      outline: none;
      resize: none;
      font-size: 16px;
      line-height: 24px;
      padding: 0px;
      background-color: transparent;
    }
    textarea::-webkit-scrollbar {
      width: 5px;
    }
    textarea::-webkit-scrollbar-thumb {
      background-color: var(--sl-color-neutral-600);
    }
    textarea::-webkit-scrollbar-track {
      background-color: transparent;
    }

  `;
}