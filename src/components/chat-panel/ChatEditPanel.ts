import { LitElement, css, html } from "lit";
import { customElement, property, queryAll, state } from "lit/decorators.js";
import { autorun } from "mobx";

import type { EditableChatSession } from "../../models/Chat";
import { ChatStore, ChatSystem } from "../../system";

@customElement('chat-edit-panel')
export class ChatEditPanel extends LitElement {

  @queryAll('.input') inputs!: NodeListOf<any>;

  @state() chat?: EditableChatSession;

  @property({ type: Boolean, reflect: true }) open: boolean = false;

  protected async firstUpdated(changedProperties: any) {
    super.firstUpdated(changedProperties);
    await this.updateComplete;

    autorun(() => {
      const title = ChatStore.title.get();
      const systemDescription = ChatStore.description.get();
      const memoryBalance = ChatStore.memoryBalance.get();
      this.chat = { title, systemDescription, memoryBalance };
    });
    autorun(() => {
      const screen = ChatSystem.screen.get();
      this.style.setProperty('--culmn-width', screen === 'large' ? '768px' : '100%');
    });
  }

  render() {
    return html`
      <div class="form">
        <chat-text-input class="input"
          required label="Copilot Name"
          .context=${this.chat} path="title"
        ></chat-text-input>
        <chat-textarea class="input"
          label="Copilot Description"
          .context=${this.chat} path="systemDescription"
        ></chat-textarea>
        <chat-range class="input"
          label="Memory Balance"
          .context=${this.chat} path="memoryBalance"
        ></chat-range>
      </div>
      <div class="control">
        <chat-button
          @click=${this.onCancel}
        >Cancle</chat-button>
        <chat-button
          @click=${this.onSave}
        >Confirm</chat-button>
      </div>
    `;
  }

  private onCancel = () => {
    const title = ChatStore.title.get();
    const systemDescription = ChatStore.description.get();
    const memoryBalance = ChatStore.memoryBalance.get();
    this.chat = { title, systemDescription, memoryBalance };
    this.open = false;
  }

  private onSave = async () => {
    const inputs = Array.from(this.inputs);
    const isValid = await Promise.all(inputs.map(input => input.validate()));
    if (!isValid.every(Boolean)) return;
    if(!this.chat) return;
    const { title, systemDescription, memoryBalance } = this.chat;
    await ChatSystem.editChat({
      title: title,
      systemDescription: systemDescription,
      memoryBalance: memoryBalance
    });
    this.open = false;
    this.dispatchEvent(new CustomEvent('saved'));
  }

  static styles = css`
    :host {
      position: absolute;
      display: none;
      flex-direction: column;
      align-items: center;
      gap: 30px;
      z-index: 5;
      top: 100%;
      right: 0;
      width: 100%;
      height: auto;
      background-color: var(--sl-color-neutral-0);
      border-bottom: 1px solid var(--sl-color-neutral-200);
      box-sizing: border-box;

      --culmn-width: 768px;
      --panel-padding: 20px;
    }
    :host([open]) {
      display: flex;
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: 20px;
      width: var(--culmn-width);
      padding: 10px var(--panel-padding);
      box-sizing: border-box;
    }

    .control {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      gap: 10px;
      width: var(--culmn-width);
      padding: 10px var(--panel-padding);
      box-sizing: border-box;
    }
  `;
}