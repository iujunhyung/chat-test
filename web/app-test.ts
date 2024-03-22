import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import "@shoelace-style/shoelace";
import "../src";

const host = import.meta.env.DEV 
? import.meta.env.VITE_HOST
: window.location.origin;

@customElement('app-test')
export class AppTest extends LitElement {

  render() {
    return html`
      <!-- <div style="display: flex">
        <div style="width: 500px">
          <h1>Chat Room</h1>
        </div>
        <div style="width: 800px;" class="resize"> -->

          <llm-chat
            type="multiple"
            .host=${host}
          ></llm-chat>
          
        <!-- </div>
      </div> -->
    `;
  }

  static styles = css`
    .resize {
      resize: both;
      overflow: auto;
      border: 1px solid #000;
    }
  `;

}