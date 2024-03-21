import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement('singular-chat')
export class SingularChat extends LitElement {

  render() {
    return html`
      <chat-header>
        <chat-button slot="prefix">
          <chat-icon name="plus-square"></chat-icon>
          New Chat
        </chat-button>
        <div slot="suffix"></div>
      </chat-header>
      <chat-room></chat-room>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
    }

    chat-header {
      height: 50px;
    }

    chat-room {
      height: calc(100% - 50px);
    }
  `;
}