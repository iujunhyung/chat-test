import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement('chat-icon-button')
export class ChatIconButton extends LitElement {
  
  @state() isHover: boolean = false;

  @property({ type: String }) name: string = '';
  @property({ type: Number }) size: number = 18;
  @property({ type: String }) color?: string;

  render() {
    return html`
      <chat-icon
        .name=${this.name}
        .size=${this.size}
        .color=${this.isHover ? '#4a90e2' : this.color}
        @mouseenter=${() => this.isHover = true}
        @mouseleave=${() => this.isHover = false}
      ></chat-icon>
    `;
  }
  
  static styles = css`
    :host {
      position: relative;
      display: inline-flex;
      transition: background-color 0.3s;
      cursor: pointer;
    }
  `;
}