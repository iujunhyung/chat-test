import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { IChatSession } from "../../models/Chat";

@customElement('chat-section-item')
export class ChatSectionItem extends LitElement {

  @property({ type: Object }) item?: IChatSession;
  @property({ type: Boolean }) selected: boolean = false;

  render() {
    return html`
      <div class="item">
        ${this.item?.title}
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
      height: 36px;
      display: flex;
      flex-direction: row;
      align-items: center;
      box-sizing: border-box;
      border-radius: 5px;
    }

    :host(:hover) {
      background-color: #f0f0f0;

      .button {
        display: block;
      }
    }

    :host([selected]) {
      background-color: #e0e0e0;

      .button {
        display: block;
      }
    }

    .item {
      position: relative;
      width: 100%;
      height: 20px;
      display: block;
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0px 5px;
      cursor: pointer;
    }

    .button {
      position: absolute;
      display: none;
      right: 0;
      top: 0;
      width: 40px;
      height: 100%;
    }
  `;
}