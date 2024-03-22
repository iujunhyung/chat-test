import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { Icon } from '../../static/Icon';

@customElement('chat-icon')
export class ChatIcon extends LitElement {
  
  @property({ type: String }) name: string = '';
  @property({ type: Number }) size?: number;
  @property({ type: String }) viewBox?: string;

  protected async updated(changedProperties: any) {
    super.updated(changedProperties);
    await this.updateComplete;
    
    if (changedProperties.has('size') && this.size) {
      this.style.fontSize = `${this.size}px`;
    }
  }

  render() {
    const data = Icon[this.name] || 'question';
    return html`
      <svg xmlns="http://www.w3.org/2000/svg"
        viewBox=${this.viewBox || '0 0 16 16'}>
        <path d=${data}></path>
      </svg>
    `;
  }
  
  static styles = css`
    :host {
      font-size: 16px;
      display: inline-block;
      box-sizing: content-box !important;
    }

    svg {
      display: block;
      width: 1em;
      height: 1em;
      fill: currentColor;
    }
  `;
}