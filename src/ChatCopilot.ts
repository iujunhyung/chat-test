import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { createComponent } from "@lit/react";
import React from "react";
import { autorun } from "mobx";

import type { SystemType, SystemScreen } from "./models/System";
import { ChatSystem } from "./system/ChatSystem";

@customElement('chat-copilot')
export class ChatCopilotElement extends LitElement {
  private readonly observer = new ResizeObserver(() => { this.handleResize() });
  private screen: SystemScreen = 'large';

  @state() ready: boolean = false;

  @property({ type: String }) type: SystemType = 'multiple';
  @property({ type: String }) host: string = window.location.host;
  @property({ type: String }) apiAccessToken?: string;
  @property({ type: Boolean }) apiAddCredential: boolean = false;

  connectedCallback() {
    super.connectedCallback();
    this.observer.observe(this);
  }

  disconnectedCallback() {
    this.observer.disconnect();
    super.disconnectedCallback();
  }

  protected async firstUpdated(_changedProperties: any) {
    super.firstUpdated(_changedProperties);
    await this.updateComplete;
    this.initialize();
  }

  render() {
    if(!this.ready) 
      return html`<initial-loader></initial-loader>`;

    if(this.type === 'single') 
      return html`<singular-chat></singular-chat>`;
    else if(this.type === 'multiple') 
      return html`<multiple-chat></multiple-chat>`;
    else if(this.type === 'inline') 
      return html`<div>Not implemented yet</div>`;
    else 
      return html`<div>Unknown chat type</div>`;
  }

  private async initialize() {
    ChatSystem.setup({
      type: this.type,
      host: this.host,
      apiAccessToken: this.apiAccessToken,
      apiAddCredential: this.apiAddCredential
    });

    autorun(() => {
      this.ready = ChatSystem.hub.ready.get();
    });
    autorun(() => {
      this.type = ChatSystem.type.get();
    });
    autorun(() => {
      this.screen = ChatSystem.screen.get();
    });
  }

  private handleResize = () => {
    const width = this.clientWidth;
    if(width < 768 && this.screen !== 'small') {
      ChatSystem.screen.set('small'); return;
    } else if(width >= 768 && width < 1100 && this.screen !== 'medium') {
      ChatSystem.screen.set('medium'); return;
    } else if(width >= 1100 && this.screen !== 'large') {
      ChatSystem.screen.set('large'); return;
    }
  }

  static styles = css`
    :host {
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  `;
}

export const ChatCopilot = createComponent({
  tagName: 'chat-copilot',
  elementClass: ChatCopilotElement,
  react: React
});