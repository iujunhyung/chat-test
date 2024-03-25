import { ChatSystem } from '../src';

/**
 * 사용하지 않음...
 */
describe('ChatSystem', () => {
  beforeEach(() => {
    // Mock the necessary dependencies or setup test environment
  });

  afterEach(() => {
    // Clean up after each test
  });

  it('should setup the chat system', () => {
    ChatSystem.setup({
      type: 'multiple',
      defaultChatTitle: 'Test Chat',
      host: 'https://localhost:40443',
      apiAccessToken: undefined,
      apiAddCredential: true
    });

    expect(ChatSystem.type.get()).toBe('multiple');
    expect(ChatSystem.defaultChatTitle).toBe('Test Chat');
    // Add more assertions for other setup configurations
  });

  it('should get chat system info', async () => {
    // Mock the necessary dependencies or setup test environment

    // const result = await ChatSystem.getInfo();

    // Add assertions to verify the result
  });

  it('should get chat system authentication config', async () => {
    // Mock the necessary dependencies or setup test environment

    // const result = await ChatSystem.getAuthConfig();

    // Add assertions to verify the result
  });

  it('should send a message', async () => {
    // Mock the necessary dependencies or setup test environment

    // const message = 'Hello, world!';
    // const result = await ChatSystem.sendMessage(message);

    // Add assertions to verify the result
  });

  // Add more tests for other methods in the ChatSystem class
});

// private async getInfo() {
  //   await ChatSystem.getInfo();
  // }
  // private async getAuthConfig() {
  //   await ChatSystem.getAuthConfig();
  // }

  // private async createChat() {
  //   await ChatSystem.createChat();
  // }

  // private async getChats() {
  //   const json = await ChatSystem.getAllChats();
  //   const id = json[0].id;
  //   ChatStore.chatID.set(id);
  // }

  // private async getChat() {
  //   await ChatSystem.getChat();
  // }

  // private async editChat() {
  //   await ChatSystem.editChat();
  // }

  // private async deleteChat() {
  //   await ChatSystem.deleteChat();
  // }

  // private async getMessages() {
  //   await ChatSystem.getMessages();
  // }

  // private async getChatArchive() {
  //   await ChatSystem.getArchive();
  // }

  // private async getChatDocument() {
  //   await ChatSystem.getDocument();
  // }

  // private async getChatMemory() {
  //   await ChatSystem.getMemories();
  // }

  // private async getChatParticipants() {
  //   await ChatSystem.getParticipants();
  // }

  // private async join() {
  //   if(this.chatID) {
  //     ChatSystem.joinChat();
  //     this.ready = true;
  //   } else {
  //     window.alert('You need to select a chat first');
  //   }
  // }

  // private async sendMessage() {
  //   const value = this.input.value;
  //   if(this.ready) {
  //     this.input.value = '';
  //     await ChatSystem.sendMessage(value);
  //   } else {
  //     window.alert('You need to join a chat first');
  //   }
  // }