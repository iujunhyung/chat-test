import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { autorun } from "mobx";

import type { SystemType } from "./models/System";
import { ChatSystem } from "./system/ChatSystem";

@customElement('llm-chat')
export class LLMChat extends LitElement {

  @state() ready: boolean = false;

  @property({ type: String }) type: SystemType = 'multiple';
  @property({ type: String }) host: string = window.location.host;
  @property({ type: String }) apiAccessToken?: string;
  @property({ type: Boolean }) apiAddCredential: boolean = false;

  protected async firstUpdated(_changedProperties: any) {
    super.firstUpdated(_changedProperties);
    await this.updateComplete;
    this.init();
  }

  render() {
    if(!this.ready) {
      return html`
        <initial-loader></initial-loader>
      `;
    }

    if(this.type === 'single') {
      return html`
        <singular-chat></singular-chat>
      `;
    }

    if(this.type === 'multiple') {
      return html`
        <multiple-chat></multiple-chat>
      `;
    }

    return html`
      <div>Unknown chat type</div>
    `;
  }

  private async init() {
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
  }

  static styles = css`
    
  `;
}