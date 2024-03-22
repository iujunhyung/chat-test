import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { ChatSystem } from "..";

@customElement('singular-chat')
export class SingularChat extends LitElement {

  render() {
    return html`
      <!-- Chat Header -->
      <chat-header>
        <!-- Header Prefix Button -->
        <chat-button slot="prefix" tooltip="Create New"
          @click=${this.createNewChat}
        >
          <chat-icon slot="prefix" name="plus-square"></chat-icon>
          New Chat
        </chat-button>
        
        <!-- Header Suffix Button -->
        <chat-icon-button slot="suffix" name="gear"
          size="22" tooltip="Setting Not Available Yet"          
        ></chat-icon-button>
      </chat-header>

      <!-- Chat Main -->
      <chat-room></chat-room>
    `;
  }

  private createNewChat = async (event: Event) => {
    const target = event.target as HTMLElement;
    target.setAttribute('loading', 'true');
    await ChatSystem.deleteAllChats();
    target.removeAttribute('loading');
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
    }

    chat-header {
      height: 50px;
    }

    chat-room {
      height: calc(100% - 50px);
    }
  `;
}