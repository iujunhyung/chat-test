import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('input-container')
export class InputContainer extends LitElement {

  @property({ type: Boolean }) required: boolean = false;
  @property({ type: String }) label?: string;
  @property({ type: String }) description?: string;
  @property({ type: Boolean }) invalid: boolean = false;
  @property({ type: String }) error?: string;

  render() {
    return html`
      <input-label
        .label=${this.label}
        .description=${this.description}
        ?required=${this.required}
      ></input-label>
      <slot></slot>
      <input-error
        ?invalid=${this.invalid}
        .message=${this.error}
      ></input-error>
    `;
  }

  static styles = css`
    :host {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
    }
  `;
}