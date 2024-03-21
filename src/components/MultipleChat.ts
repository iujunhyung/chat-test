import { LitElement, css, html, nothing } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { autorun } from "mobx";

import type { SystemScreen } from "../models";
import { ChatSystem } from "../system/ChatSystem";

@customElement('multiple-chat')
export class MultipleChat extends LitElement {
  
  @query('.panel') panel!: HTMLDivElement;
  @query('.overlay') overlay!: HTMLDivElement;

  @state() screen: SystemScreen = 'large';

  protected async firstUpdated(changedProperties: any) {
    super.firstUpdated(changedProperties);
    await this.updateComplete;
    autorun(() => {
      this.screen = ChatSystem.screen.get();
      this.adjustPanelPosition();
    });
    autorun(() => {
      const open = ChatSystem.openSideBar.get();
      this.togglePanel(open);
    });
  }

  render() {
    return html`
      <!-- Chat Session List Side Bar -->
      <div class="panel">
        <chat-side-bar></chat-side-bar>
      </div>

      <!-- Current Main Chat Room -->
      <div class="main">
        <chat-header class="header">
          ${this.renderToggler()}
          <div slot="suffix"></div>
        </chat-header>
        <chat-room></chat-room>
      </div>

      <!-- Side Bar overlay in small size -->
      <div class="overlay" 
        @click=${() => ChatSystem.openSideBar.set(false)}
      ></div>
    `;
  }

  private renderToggler() {
    if(this.screen !== 'small') return nothing;
    return html`
      <chat-icon-button class="toggler" slot="prefix" name="list"
        @click=${() => ChatSystem.openSideBar.set(true)}
      ></chat-icon-button>
    `;
  }

  private adjustPanelPosition() {
    if(this.screen === 'small') {
      this.panel.classList.add('top');
      this.togglePanel(false);
    } else {
      this.panel.classList.remove('top');
      this.togglePanel(true);
    }
  }

  private togglePanel(open: boolean) {
    if(this.screen === 'small') {
      if(open) {
        this.panel.classList.add('open');
        this.overlay.style.display = 'block';
      } else {
        this.panel.classList.remove('open');
        this.overlay.style.display = 'none';
      }
    } else {
      this.overlay.style.display = 'none';
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
      z-index: 10;
      top: 0;
      left: 0;
      width: 260px;
      height: 100%;
    }
    .panel.top {
      position: absolute;
      overflow: hidden;
      transform: translateX(-260px);
      transition: transform 0.3s ease-in-out;
    }
    .panel.top.open {
      transform: translateX(0);
      overflow: unset;
    }

    .overlay {
      position: absolute;
      display: none;
      z-index: 9;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .main {
      position: relative;
      flex: 1;

      .header {
        position: relative;
        height: var(--header-height);
        border: 1px solid black;
      }

      chat-room {
        position: relative;
        height: calc(100% - var(--header-height));
      }
    }
  `;
}