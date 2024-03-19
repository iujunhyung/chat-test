import { LitElement, css, html } from "lit";
import { customElement, query } from "lit/decorators.js";

import "@shoelace-style/shoelace"

@customElement('chat-input')
export class ChatInput extends LitElement {

  @query('textarea') input!: HTMLTextAreaElement;

  render() {
    return html`
      <sl-icon-button
        .name=${'paperclip'}
      ></sl-icon-button>
      <textarea
        .value=${''}
      ></textarea>
      <sl-icon-button
        .name=${'send'}
      ></sl-icon-button>
    `;
  }

  static styles = css`
    :host {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      gap: 10px;
      align-items: flex-end;
      box-sizing: border-box;

      border: 1px solid black;
      padding: 100px;
      border-radius: 1rem;
    }

    textarea {
      width: 100%;
      -webkit-appearance: none;
      appearance: none;
      /* border: none; */
      outline: none;
      resize: none;
      font-size: 16px;
      line-height: 24px;
    }
  `;
}