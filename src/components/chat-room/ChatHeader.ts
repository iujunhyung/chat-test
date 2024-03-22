import { LitElement, css, html } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { autorun } from "mobx";

import { ChatStore } from "../../system";

@customElement('chat-header')
export class ChatHeader extends LitElement {

  @query('.edit') edit!: any;
  @query('.panel') panel!: HTMLElement;

  @state() label: string = "Chat Room";

  protected async firstUpdated(changedProperties: any) {
    super.firstUpdated(changedProperties);
    await this.updateComplete;

    autorun(() => {
      this.label = ChatStore.title.get();
    });
  }

  render() {
    return html`
      <div class="prefix">
        <slot name="prefix"></slot>
      </div>
      <div class="center">
        <div class="title">${this.label}</div>
        <chat-icon-button class="edit"
          name="pencil-square" tooltip="Edit"
          @click=${() => this.panel.toggleAttribute('open')}
        ></chat-icon-button>
      </div>
      <div class="suffix">
        <slot name="suffix"></slot>
      </div>
      <chat-edit-panel class="panel"
        @saved=${this.handleSaved}
      ></chat-edit-panel>
    `;
  }

  private handleSaved() {
    this.edit.name = "check";
    this.edit.color = "green";
    this.edit.cursor = "default";
    setTimeout(() => {
      this.edit.name = "pencil-square";
      this.edit.color = "";
      this.edit.cursor = "pointer";
    }, 1000);
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
      }
    }

    .suffix {
      display: block;
    }
    
  `;
}