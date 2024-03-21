import { LitElement, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";

export type Position = ( 
  'top' | 
  'bottom' | 'bottom-left' |
  'right-bottom'
);

@customElement('chat-popup')
export class ChatPopup extends LitElement {
  
  @query('.popup') popup!: HTMLElement;
  
  @property({ type: Boolean, reflect: true }) open: boolean = false;
  @property({ type: String }) position: Position = 'bottom';
  @property({ type: String }) distance: string = '0px';

  protected async updated(changedProperties: any) {
    super.updated(changedProperties);
    await this.updateComplete;

    if (changedProperties.has('position')) {
      this.positionPopup(this.position);
    }
    if (changedProperties.has('distance') && this.distance) {
      this.style.setProperty('--popup-distance', this.distance);
    }
  }

  render() {
    return html`
      <slot></slot>
      <div class="popup">
        <slot name="content"></slot>
      </div>
    `;
  }

  private positionPopup(position?: Position) {
    const style = this.popup.style;
    switch (position) {
      case 'top':
        style.top = 'unset';
        style.bottom = 'calc(100% + var(--popup-distance))';
        style.left = '50%';
        style.right = 'unset';
        style.transform = 'translateX(-50%)';
        break;
      case 'bottom':
        style.top = 'calc(100% + var(--popup-distance))';
        style.bottom = 'unset';
        style.left = '50%';
        style.right = 'unset';
        style.transform = 'translateX(-50%)';
        break;
      case 'bottom-left':
        style.top = 'calc(100% + var(--popup-distance))';
        style.bottom = 'unset';
        style.left = 'unset';
        style.right = '0px';
        style.transform = 'translateX(0%)';
        break;
      case 'right-bottom':
        style.top = '0px';
        style.bottom = 'unset';
        style.left = 'calc(100% + var(--popup-distance))';
        style.right = 'unset';
        style.transform = 'translateX(0%)';
        break;
      default:
        // 기본 Bottom
        style.top = 'calc(100% + var(--popup-distance))';
        style.bottom = 'unset';
        style.left = '50%';
        style.right = 'unset';
        style.transform = 'translateX(-50%)';
    }
  }
  
  static styles = css`
    :host {
      position: relative;
      display: inline-flex;

      --popup-distance: 0px;
    }
    :host([open]) .popup {
      display: inline-block;
    }

    .popup {
      position: absolute;
      z-index: 1000;
      display: none;
    }
  `;
}