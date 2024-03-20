import { LitElement, css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import { ChatSystem } from '../../system/ChatSystem';
import { autorun } from "mobx";
import { ChatStore } from "../../system";

@customElement('chat-input')
export class ChatInput extends LitElement {

  @query('textarea') input!: HTMLTextAreaElement;
  @state() status?: string;
  @property({ type: String }) value: string = '';

  connectedCallback() {
    super.connectedCallback();
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
      <div class="status">
        ${this.status}
      </div>
      <sl-icon-button
        .name=${'paperclip'}
      ></sl-icon-button>
      <textarea
        rows="1"
        @input=${this.handleInput}
        @keydown=${this.handleKeyDown}
      ></textarea>
      <sl-icon-button
        .name=${'send'}
      ></sl-icon-button>
    `;
  }

  private handleKeyDown = async (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      const message = this.value;
      this.input.value = '';
      this.value = '';
      if(!message) return;
      await ChatSystem.sendMessage(message);
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

  static styles = css`
    :host {
      position: relative;
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: row;
      gap: 5px;
      align-items: flex-end;
      box-sizing: border-box;

      border: 1px solid black;
      padding: 10px;
      border-radius: 1rem;
    }

    .status {
      position: absolute;
      top: -40px;
      left: 10px;
      font-size: 12px;
      line-height: 18px;

    }

    textarea {
      width: 100%;
      min-height: 24px;
      max-height: 200px;
      overflow-y: auto;
      -webkit-appearance: none;
      appearance: none;
      /* border: none; */
      outline: none;
      resize: none;
      font-size: 16px;
      line-height: 24px;
      padding: 0px;
    }
  `;
}