import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('input-error')
export class InputError extends LitElement {

  @property({ type: Boolean, reflect: true }) invalid: boolean = false;
  @property({ type: String }) message?: string;

  render() {
    return html`
      ${this.message || nothing}
    `;
  }

  static styles = css`
    :host {
      display: none;
      padding: 0px 3px;
      box-sizing: border-box;
      font-size: 12px;
      line-height: 18px;
      font-weight: 600;
      word-break: break-word;
      color: red;
    }
    :host([invalid]) {
      display: inline-block;
    }
  `;
}