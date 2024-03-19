import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

import './chat-list/ChatList';
import './chat-view/ChatRoom';

@customElement('multiple-chat')
export class MultipleChat extends LitElement {

  render() {
    return html`
      <chat-list></chat-list>
      <chat-room></chat-room>
    `;
  }

  static styles = css`
    :host {
      container-name: chat-container;
      container-type: inline-size;
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
    }

    chat-list {
      position: relative;
      width: 20%;
      height: 100%;
    }

    chat-room {
      position: relative;
      width: 80%;
      height: 100%;
    }

    @container chat-container (max-width: 768px) {
      chat-list {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 50%;
      }

      chat-room {
        width: 100%;
      }
    }
  `;
}