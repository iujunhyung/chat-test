import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('chat-section')
export class ChatSection extends LitElement {

  @property({ type: String }) 
  label?: string;

  render() {
    return html`
      <label>${this.label}</label>
      <slot></slot>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 5px;
      box-sizing: border-box;
      padding: 10px;
      
      border: 1px solid black;
    }

    label {
      font-size: 18px;
      line-height: 24px;
      font-weight: bold;
    }
  `;
}