import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import "./src";

const host = import.meta.env.DEV 
? import.meta.env.VITE_HOST
: window.location.origin;

@customElement('app-test')
export class AppTest extends LitElement {

  render() {
    return html`
      <llm-chat
        .host=${host}
      ></llm-chat>
      <!-- <chat-test></chat-test> -->
    `;
  }

}