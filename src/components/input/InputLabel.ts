import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('input-label')
export class InputLabel extends LitElement {

  @property({ type: Boolean }) required: boolean = false;
  @property({ type: String }) label?: string;
  @property({ type: String }) description?: string;

  render() {
    return html`
      <label>
        ${this.required ? html`<span>*</span>` : nothing}
        ${this.label || html`<slot></slot>`}
        ${this.description ? html`<span>${this.description}</span>` : nothing}
      </label>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: auto;
      height: auto;
      padding: 0px 3px;
      box-sizing: border-box;
    }

    label {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      line-height: 14px;
      font-weight: 600;

      span {
        color: red;
      }
    }
  `;
}