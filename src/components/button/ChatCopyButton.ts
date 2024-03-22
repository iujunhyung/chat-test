import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('chat-copy-button')
export class ChatCopyButton extends LitElement {
  
  @property({ type: Boolean, reflect: true }) isCopied: boolean = false;
  @property({ type: String }) value?: string;
  @property({ type: Number }) size: number = 14;

  render() {
    return html`
      <chat-tooltip position="right-bottom" 
        content=${this.isCopied ? 'Copied!' : 'Copy to Clipboard'}
      >
        <chat-icon
          .name=${this.isCopied ? 'check' : 'copy'}
          .size=${this.size}
          @click=${this.copyToClipboard}
        ></chat-icon>
      </chat-tooltip>
    `;
  }

  private async copyToClipboard() {
    if (this.isCopied || !this.value) return;
    await navigator.clipboard.writeText(this.value);
    this.isCopied = true;
    setTimeout(() => {
      this.isCopied = false;
    }, 1_500);
  }
  
  static styles = css`
    :host {
      position: relative;
      display: inline-flex;
    }
    :host([isCopied]) chat-icon {
      cursor: default;
      color: green;
    }
    chat-icon {
      cursor: pointer;
    }
  `;
}