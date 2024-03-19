import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { IChatSession } from "../../models/Chat";

@customElement('chat-section-item')
export class ChatSectionItem extends LitElement {

  @property({ type: Object })
  item?: IChatSession;

  @property({ type: Boolean })
  selected: boolean = false;

  render() {
    return html`
      <div class="item">
        <label>${this.item?.title}</label>
      </div>
      <div class="button">
        <button>버튼</button>
      </div>
    `;
  }

  static styles = css`
    :host {
      position: relative;
      width: 100%;
      height: 38px;
      display: flex;
      flex-direction: row;
      align-items: center;
      box-sizing: border-box;
      padding: 10px;

      border: 1px solid black;
    }

    :host(:hover) {
      background-color: #f0f0f0;
    }

    :host([selected]) {
      background-color: #e0e0e0;
    }

    .item {
      width: 90%;
      display: block;
      
      label {
        font-size: 16px;
        line-height: 24px;
        font-weight: 400;
        white-space: nowrap;
        word-wrap: break-word;
        text-overflow: ellipsis;
        cursor: pointer;
      }
    }

    .button {
      width: 10%;
      display: block;
    }
  `;
}