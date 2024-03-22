import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement('chat-icon-button')
export class ChatIconButton extends LitElement {
  
  @state() isHover: boolean = false;

  @property({ type: Boolean, reflect: true }) loading: boolean = false;
  @property({ type: String }) name: string = '';
  @property({ type: Number }) size: number = 18;
  @property({ type: String }) tooltip?: string;

  render() {
    return this.tooltip
      ? this.renderIconWithTooltip()
      : this.renderIcon();
  }

  private renderIconWithTooltip() {
    return html`
      <chat-tooltip
        position="bottom"
        .content=${this.tooltip}
      >
        ${this.renderIcon()}
      </chat-tooltip>
    `;
  }

  private renderIcon() {
    if(this.loading) {
      return html`
        <loading-spinner
          size=${`${this.size}px`}
        ></loading-spinner>
      `;
    } else {
      return html`
        <chat-icon
          .name=${this.name}
          .size=${this.size}
        ></chat-icon>
      `;
    }
  }
  
  static styles = css`
    :host {
      position: relative;
      display: inline-flex;
      transition: background-color 0.3s;
      cursor: pointer;
    }
    :host([loading]) {
      pointer-events: none;
      cursor: progress;
    }
    
    chat-icon {
      color: var(--sl-color-neutral-600);
    }
    chat-icon:hover {
      color: #4a90e2;
    }
  `;
}