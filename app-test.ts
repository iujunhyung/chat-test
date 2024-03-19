import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ChatSystem }from "./src";

const host = import.meta.env.DEV 
? import.meta.env.VITE_HOST
: window.location.origin;

ChatSystem.setup({
  host: host
});

@customElement('app-test')
export class AppTest extends LitElement {

  render() {
    return html`
      <llm-chat></llm-chat>
      <!-- <chat-test></chat-test> -->
    `;
  }

}