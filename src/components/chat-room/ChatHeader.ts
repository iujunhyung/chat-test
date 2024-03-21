import { LitElement, css, html } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { autorun } from "mobx";

import { ChatSystem, ChatStore } from "../../system";

@customElement('chat-header')
export class ChatHeader extends LitElement {

  @query('.slider') slider!: HTMLDivElement;
  @query('.title') titleEl!: HTMLSpanElement;

  @state() openSlider: boolean = true;
  @state() label: string = "Chat Room";
  @state() description?: string;
  @state() memoryBalance?: number;

  protected async firstUpdated(changedProperties: any) {
    super.firstUpdated(changedProperties);
    await this.updateComplete;

    autorun(() => {
      this.label = ChatStore.title.get();
      this.description = ChatStore.description.get();
      this.memoryBalance = ChatStore.memoryBalance.get();
    });
  }

  protected async updated(changedProperties: any) {
    super.updated(changedProperties);
    await this.updateComplete;

    if (changedProperties.has('openSlider')) {
      this.toggleSlider();
    }
  }

  render() {
    return html`
      <div class="prefix">
        <slot name="prefix"></slot>
      </div>
      <div class="center">
        <div class="title"
          
        >${this.label}</div>
        ${this.openSlider 
          ? html`
            <chat-icon-button name="check-square" color="green"
              tooltip="Save"
              @click=${this.updateChat}
            ></chat-icon-button>
            <chat-icon-button name="x-square" color="red"
              tooltip="Cancel"
              @click=${() => this.openSlider = false}
            ></chat-icon-button>`
          : html`
            <chat-icon-button name="pencil-square"
              tooltip="Edit"
              @click=${() => this.openSlider = true}
            ></chat-icon-button>`
        }
      </div>
      <div class="suffix">
        <slot name="suffix"></slot>
      </div>
      <div class="slider">
        <div class="form">
          <chat-textarea
            label="System Description"
            .value=${this.description || ""}
          ></chat-textarea>
          <chat-range
            label="Memory Balance"
            .value=${this.memoryBalance || 0.5}
            required
          ></chat-range>
        </div>
      </div>
    `;
  }

  private async toggleSlider() {
    if (this.openSlider) {
      this.slider.classList.add('open');
      this.titleEl.contentEditable = "true";
      this.titleEl.focus();
    } else {
      this.slider.classList.remove('open');
      this.titleEl.contentEditable = "false";
    }
  }

  private async updateChat() {
    return;
    await ChatSystem.editChat();
  }

  static styles = css`
    :host {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 5px;
      padding: 0 20px;
      box-sizing: border-box;
    }

    .prefix {
      display: block;
    }

    .center {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
      
      .title {
        max-width: 260px;
        font-size: 16px;
        line-height: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        outline: none;
      }
      .title[contenteditable="true"] {
        border-bottom: 1px solid var(--sl-color-gray-500);
      }
    }

    .suffix {
      display: block;
    }

    .slider {
      position: absolute;
      display: flex;
      justify-content: center;
      z-index: 1;
      top: 100%;
      left: 0;
      width: 100%;
      height: 0px;
      box-sizing: border-box;
      background-color: var(--sl-color-neutral-0);
      border-bottom: 1px solid var(--sl-color-gray-200);
      transition: height 0.3s ease-in-out;
      overflow: hidden;

      .form {
        width: 768px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        padding: 10px 50px;
        box-sizing: border-box;
      }
    }
    .slider.open {
      height: 300px;
      overflow-y: auto;
    }
    
  `;
}