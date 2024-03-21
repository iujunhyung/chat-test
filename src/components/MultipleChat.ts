import { LitElement, css, html } from "lit";
import { customElement, query, state } from "lit/decorators.js";

@customElement('multiple-chat')
export class MultipleChat extends LitElement {
  private readonly observer = new ResizeObserver(() => {
    this.handleResize();
  });

  @state() screen: 'small' | 'medium' | 'large' = 'large';
  @state() panelOpen = false;

  @query('.panel') panel!: HTMLDivElement;
  @query('.overlay') overlay!: HTMLDivElement;
  @query('.main') main!: HTMLDivElement;
  @query('chat-room') chatRoom!: HTMLElement;

  connectedCallback() {
    super.connectedCallback();
    this.observer.observe(this);
  }

  disconnectedCallback() {
    this.observer.disconnect();
    super.disconnectedCallback();
  }

  protected async updated(changedProperties: any) {
    super.updated(changedProperties);
    await this.updateComplete;
    if (changedProperties.has('screen')) {
      this.changeScreen();
    }
    if (changedProperties.has('panelOpen')) {
      this.togglePanel();
    }
  }

  render() {
    return html`
      <div class="panel">
        <chat-list></chat-list>
        <chat-icon-button class="toggler" name="list" size="24"
          @click=${() => this.panelOpen = !this.panelOpen}
        ></chat-icon-button>
      </div>
      <div class="overlay"
        @click=${() => this.panelOpen = false}
      ></div>
      <div class="main">
        <chat-header class="header">
          <div slot="prefix"></div>
          <div slot="suffix"></div>
        </chat-header>
        <chat-room></chat-room>
      </div>
    `;
  }

  private handleResize = () => {
    const width = this.clientWidth;
    if(width < 768 && this.screen !== 'small') {
      this.screen = 'small'; return;
    } else if(width >= 768 && width < 1100 && this.screen !== 'medium') {
      this.screen = 'medium'; return;
    } else if(width >= 1100 && this.screen !== 'large') {
      this.screen = 'large'; return;
    }
  }

  private changeScreen = () => {
    if (this.screen === 'small') {
      this.panel.classList.add('small');
      this.main.classList.add('small');
      this.chatRoom.classList.add('medium');
      if (this.panelOpen) this.panelOpen = false;
    } else if (this.screen === 'medium') {
      this.panel.classList.remove('small');
      this.main.classList.remove('small');
      this.chatRoom.classList.add('medium');
      if (this.panelOpen) this.panelOpen = false;
    } else {
      this.panel.classList.remove('small');
      this.main.classList.remove('small');
      this.chatRoom.classList.remove('medium');
      if (this.panelOpen) this.panelOpen = false;
    }
  }

  private togglePanel = () => {
    if (this.panelOpen) {
      this.panel.classList.add('open');
      this.overlay.classList.add('open');
    } else {
      this.panel.classList.remove('open');
      this.overlay.classList.remove('open');
    }
  }

  static styles = css`
    :host {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;

      --header-height: 50px;
    }

    .panel {
      position: relative;
      width: 260px;
      height: 100%;
      background-color: var(--sl-color-gray-50);
      transition: width 0.2s ease-in-out;

      .toggler {
        display: none;
        position: absolute;
        z-index: 2;
        top: 13px;
        right: -40px;
      }
    }
    .panel.small {
      position: absolute;
      z-index: 2;
      top: 0;
      left: 0;
      width: 0px;
      
      .toggler {
        display: flex;
      }
    }
    .panel.small.open {
      width: 260px;
    }

    .overlay {
      display: none;
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }
    .overlay.open {
      display: block;
    }

    .main {
      position: relative;
      width: calc(100% - 260px);
      height: 100%;

      &.small {
        width: 100%;
      }

      .header {
        position: relative;
        width: 100%;
        height: var(--header-height);
        border: 1px solid black;
      }

      chat-room {
        position: relative;
        width: 100%;
        height: calc(100% - var(--header-height));

        &.medium {
          --column-width: 100%;
        }
      }
    }
  `;
}