import { LitElement, css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

@customElement('chat-range')
export class ChatRange extends LitElement {

  @query('input') input!: HTMLInputElement;
  @query('.tooltip') tooltip!: HTMLDivElement;

  @state() left?: string;
  @state() right?: string;

  @property({ type: Boolean }) invalid: boolean = false;
  @property({ type: String }) error?: string;

  @property({ type: String }) label?: string;
  @property({ type: String }) description?: string;
  @property({ type: Number }) min: number = 0;
  @property({ type: Number }) max: number = 1;
  @property({ type: Number }) step: number = 0.01;

  @property({ type: Object }) context?: any;
  @property({ type: String }) path?: string;
  @property({ type: Number }) value?: number;

  protected updated(changedProperties: any) {
    if (changedProperties.has('context') && this.context && this.path) {
      this.value = this.context[this.path];
    }
    if (changedProperties.has('value') && this.value) {
      this.left = Math.round(this.value / this.max * 100) + '%';
      this.right = Math.round((1 - this.value / this.max) * 100) + '%';
    }
  }

  render() {
    return html`
      <input-container
        ?invalid=${this.invalid}
        .label=${this.label}
        .description=${this.description}
        .error=${'error'}
      >
        <div class="container">
          <div class="left">${this.left}</div>
          <input type="range"
            @input=${this.handleInput}
            min=${this.min}
            max=${this.max}
            step=${this.step}
            value=${this.value || this.min}
          />
          <div class="right">${this.right}</div>
        </div>
      </input-container>
    `;
  }

  private handleInput = () => {
    const value = this.input.value;
    this.value = parseFloat(value);
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
      width: 100%;

      --side-width: 30px;
    }

    .container {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 5px;
    }

    .left, .right {
      display: block;
      width: var(--side-width);
    }

    input {
      display: block;
      width: calc(100% - var(--side-width) * 2);
    }
    input::-webkit-slider-thumb {
      background-color: red;
    }
  `;
}