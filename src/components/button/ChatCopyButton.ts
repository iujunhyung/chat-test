import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement('chat-copy-button')
export class ChatCopyButton extends LitElement {
  
  @state() icon: 'copy' | 'check' = 'copy';

  @property({ type: String }) value?: string;
  @property({ type: Number }) size: number = 14;

  render() {
    return html`
      <chat-tooltip position="right-bottom" 
        content=${this.icon === 'check' ? 'Copied!' : 'Copy to Clipboard'}
      >
        <chat-icon
          .name=${this.icon}
          .size=${this.size}
          .color=${this.icon === 'check' ? 'green' : undefined}
          @click=${this.copyToClipboard}
        ></chat-icon>
      </chat-tooltip>
    `;
  }

  private async copyToClipboard() {
    if (this.icon === 'check' || !this.value) return;
    this.style.cursor = 'default';
    await navigator.clipboard.writeText(this.value);
    this.icon = 'check';
    setTimeout(() => {
      this.icon = 'copy'
      this.style.cursor = 'pointer';
    }, 1_500);
  }
  
  static styles = css`
    :host {
      position: relative;
      display: inline-flex;
      cursor: pointer;
    }
  `;
}