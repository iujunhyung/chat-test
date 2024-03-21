import { LitElement, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";

@customElement('chat-textarea')
export class ChatTextarea extends LitElement {

  @query('textarea') input!: HTMLTextAreaElement;

  @property({ type: Boolean, reflect: true }) invalid: boolean = false;
  @property({ type: String }) label?: string;
  @property({ type: String }) description?: string;
  @property({ type: Boolean }) required: boolean = false;
  @property({ type: String }) error?: string;
  @property({ type: String }) value?: string;
  @property({ type: String }) placeholder?: string;

  render() {
    return html`
      <input-container
        ?invalid=${this.invalid}
        .label=${this.label}
        .description=${this.description}
        ?required=${this.required}
        .error=${'error'}
      >
        <textarea
          ?required=${this.required}
          .value=${this.value || ''}
          .placeholder=${this.placeholder || ''}
        ></textarea>
      </input-container>
    `;
  }

  public async validate() {
    const isValid = this.input.reportValidity();
    console.log('isValid', isValid);
    return isValid;
  }

  static styles = css`
    :host {
      position: relative;
      width: 100%;
    }
    :host([invalid]) textarea {
      border: 2px solid red;
    }
    textarea {
      width: 100%;
      height: 100px;
      padding: 5px 10px;
      resize: none;
      outline: none;
      font-size: 14px;
      line-height: 18px;
      box-sizing: border-box;
      border: 2px solid var(--sl-color-neutral-300);
      border-radius: 5px;
    }
    textarea:focus {
      border: 2px solid var(--sl-color-primary-500);
    }
    textarea::-webkit-scrollbar {
      width: 5px;
    }
    textarea::-webkit-scrollbar-thumb {
      background-color: var(--sl-color-neutral-600);
      border-radius: 5px;
    }
    textarea::-webkit-scrollbar-track {
      background-color: transparent;
    }
  `;
}