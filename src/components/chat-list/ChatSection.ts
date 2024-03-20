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
      padding: 12px;
      
      border: 1px solid black;
    }

    label {
      font-size: 12px;
      line-height: 16px;
      font-weight: 500;
      padding: 0px 5px;
    }
  `;
}