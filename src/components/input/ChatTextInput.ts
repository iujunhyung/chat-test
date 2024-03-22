import { LitElement, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";

@customElement('chat-text-input')
export class ChatTextInput extends LitElement {

  @query('input') input!: HTMLInputElement;

  @property({ type: Boolean, reflect: true }) invalid: boolean = false;
  @property({ type: String }) error?: string;

  @property({ type: Boolean }) required: boolean = false;
  @property({ type: String }) label?: string;
  @property({ type: String }) description?: string;
  @property({ type: String }) placeholder?: string;
  
  @property({ type: Object }) context?: any;
  @property({ type: String }) path?: string;
  @property({ type: String }) value?: string;

  protected updated(changedProperties: any) {
    if (changedProperties.has('context') && this.context && this.path) {
      this.value = this.context[this.path];
    }
  }

  render() {
    return html`
      <input-container
        ?invalid=${this.invalid}
        .label=${this.label}
        .description=${this.description}
        ?required=${this.required}
        .error=${this.error}
      >
        <input
          type="text"
          ?required=${this.required}
          .value=${this.value || ''}
          .placeholder=${this.placeholder || ''}
          @input=${this.handleInput}
        />
      </input-container>
    `;
  }

  private handleInput = () => {
    this.value = this.input.value;
    if(this.context && this.path) {
      this.context[this.path] = this.value;
    }
  }

  public async validate() {
    const isValid = this.input.reportValidity();
    console.log('isValid', isValid);
    return isValid;
  }

  static styles = css`
    :host {
      position: relative;
      display: block;
    }
    :host([invalid]) input {
      border: 2px solid red;
    }

    input {
      width: 100%;
      padding: 5px 10px;
      outline: none;
      font-size: 14px;
      line-height: 18px;
      box-sizing: border-box;
      border: 2px solid var(--sl-color-neutral-300);
      border-radius: 5px;
    }
    input:focus {
      border: 2px solid var(--sl-color-primary-500);
    }
  `;
}
