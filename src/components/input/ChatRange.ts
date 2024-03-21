import { LitElement, css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

@customElement('chat-range')
export class ChatRange extends LitElement {

  @query('input') input!: HTMLInputElement;
  @query('.tooltip') tooltip!: HTMLDivElement;

  @state() left?: string;
  @state() right?: string;
  @state() error?: string;

  @property({ type: Boolean }) invalid: boolean = false;
  @property({ type: String }) label?: string;
  @property({ type: String }) description?: string;
  @property({ type: Boolean }) required: boolean = false;
  @property({ type: Number }) min: number = 0;
  @property({ type: Number }) max: number = 1;
  @property({ type: Number }) step: number = 0.01;
  @property({ type: Number }) value?: number;

  render() {
    return html`
      <input-container
        ?invalid=${this.invalid}
        .label=${this.label}
        .description=${this.description}
        ?required=${this.required}
        .error=${'error'}
      >
        <div class="container">
          <div class="left">${this.left}</div>
          <input type="range"
            @input=${this.handleInput}
            @mousedown=${this.openTooltip}
            @mouseup=${this.closeTooltip}
            ?required=${this.required}
            min=${this.min}
            max=${this.max}
            step=${this.step}
            value=${this.value || this.min}
          />
          <div class="right">${this.right}</div>
          <div class="tooltip">${this.value}</div>
        </div>
      </input-container>
    `;
  }

  private handleInput = () => {
    const value = this.input.value;
    this.value = parseFloat(value);

    this.left = this.value / this.max * 100 + '%';
    this.right = (1 - this.value / this.max) * 100 + '%';
  }

  private openTooltip = () => {
    this.tooltip.style.display = 'block';
  }

  private closeTooltip = () => {
    this.tooltip.style.display = 'none';
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

    .tooltip {
      display: none;
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #000;
      color: #fff;
      padding: 5px;
      border-radius: 5px;
      display: none;
    }
  `;
}