import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('initial-loader')
export class InitialLoader extends LitElement {

  @property({ type: String }) message: string = 'Loading...';

  render() {
    return html`
      <div class="loader"></div>
      <div class="message">${this.message}</div>
    `;
  }

  static styles = css`
    :host {
      position: absolute;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
      background: rgba(0, 0, 0, 0.1);
    }

    .loader {
      width: 50px;
      aspect-ratio: 1;
      display: grid;
      border-radius: 50%;
      background:
        linear-gradient(0deg ,rgb(0 0 0/50%) 30%,#0000 0 70%,rgb(0 0 0/100%) 0) 50%/8% 100%,
        linear-gradient(90deg,rgb(0 0 0/25%) 30%,#0000 0 70%,rgb(0 0 0/75% ) 0) 50%/100% 8%;
      background-repeat: no-repeat;
      animation: l23 1s infinite steps(12);

      &::before,
      &::after {
        content: "";
        grid-area: 1/1;
        border-radius: 50%;
        background: inherit;
        opacity: 0.915;
        transform: rotate(30deg);
      }
      &::after {
        opacity: 0.83;
        transform: rotate(60deg);
      }
    }
    
    @keyframes l23 {
      100% {transform: rotate(1turn)}
    }

    .message {
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
    }
  `;;
}