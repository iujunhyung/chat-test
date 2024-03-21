import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('loading-spinner')
export class LoadingSpinner extends LitElement {
  
  @property({ type: String }) size?: string;
  @property({ type: String }) color?: string;

  protected async updated(changedProperties: any) {
    super.updated(changedProperties);
    await this.updateComplete;

    if (changedProperties.has('size')) {
      const size = this.size || '50px';
      const trackWidth = `${parseInt(size) / 6}px`; // 트랙의 넓이를 계산
      this.style.setProperty('--spinner-size', size);
      this.style.setProperty('--track-width', trackWidth); // CSS 변수 업데이트
    }
    if (changedProperties.has('color')) {
      const color = this.color || 'var(--sl-color-neutral-800)';
      this.style.setProperty('--spinner-color', color);
    }
  }

  render() {
    return html`
      <div class="loader"></div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      --spinner-size: 50px;
      --spinner-color: var(--sl-color-neutral-800);
      --track-width: 8px;
    }

    .loader {
      width: var(--spinner-size);
      aspect-ratio: 1;
      border-radius: 50%;
      background: 
        radial-gradient(farthest-side,var(--spinner-color) 94%,#0000) top/var(--track-width) var(--track-width) no-repeat,
        conic-gradient(#0000 30%,var(--spinner-color));
      -webkit-mask: radial-gradient(farthest-side,#0000 calc(100% - var(--track-width)),#000 0);
      animation: l13 1s infinite linear;
    }
    @keyframes l13{ 
      100%{transform: rotate(1turn)}
    }
  `;
}