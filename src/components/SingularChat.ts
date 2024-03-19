import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

import './chat-room/ChatRoom';

@customElement('singular-chat')
export class SingularChat extends LitElement {

  render() {
    return html`
      <chat-room></chat-room>
    `;
  }

  static styles = css`
    
  `;
}