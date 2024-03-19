import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { autorun } from "mobx";
import type { SystemType } from "./models/System";

import "./components/loading/InitialLoader";
import "./components/SingularChat";
import "./components/MultipleChat";

import { ChatSystem } from "./ChatSystem";

@customElement('llm-chat')
export class LLMChat extends LitElement {

  @state() ready: boolean = false;
  @property({ type: String }) type: SystemType = 'multiple';

  connectedCallback() {
    super.connectedCallback();

    autorun(() => {
      this.ready = ChatSystem.hub.ready.get();
    });
    autorun(() => {
      this.type = ChatSystem.type.get();
    });
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

  static styles = css`
    
  `;
}