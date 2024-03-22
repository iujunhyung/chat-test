import { observable, IObservableValue } from "mobx";
import { ChatAPI } from "./ChatAPI";
import { ChatHub } from "./ChatHub";
import { ChatStore } from "./ChatStore";

import type { 
  ChatConfig,
  SystemType,
  SystemTheme,
  SystemScreen
} from "../models/System";
import type { 
  EditableChatSession,
  IChatSession 
} from "../models/Chat";

export class ChatSystem {
  
  public static type: IObservableValue<SystemType> = observable.box<SystemType>('multiple');
  public static screen: IObservableValue<SystemScreen> = observable.box<SystemScreen>('large');
  public static openSidebar: IObservableValue<boolean> = observable.box<boolean>(false);
  public static theme: SystemTheme = 'light';
  public static defaultChatTitle?: string;
  public static api: ChatAPI = new ChatAPI();
  public static hub: ChatHub = new ChatHub();

  public static setup(config: ChatConfig) {
    this.type.set(config.type || 'multiple');
    this.defaultChatTitle = config.defaultChatTitle;
    this.theme = localStorage.getItem('chat-theme') as SystemTheme || this.theme;
    this.updateTheme();
    this.api.setup({
      host: config.host,
      apiAccessToken: config.apiAccessToken,
      apiAddCredential: config.apiAddCredential
    });
    this.hub.setup({
      host: config.host
    });
    this.refresh();
  }

  public static toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.updateTheme();
  }

  public static updateTheme(theme: SystemTheme = this.theme) {
    if(theme === 'light') {
      document.documentElement.classList.remove('sl-theme-dark');
    } else {
      document.documentElement.classList.add('sl-theme-dark');
    }
    localStorage.setItem('chat-theme', theme);
  }

  public static async sendMessage(message: string) {
    const id = ChatStore.chatID.get();
    if(!id) throw new Error('Chat Session is not set');
    try {
      ChatStore.messages.set([...ChatStore.messages.get(), {
        authorRole: 0,
        chatId: id,
        content: message,
        timestamp: new Date().getTime(),
        type: 0,
        userId: ChatStore.userID.get(),
        userName: 'Default User'
      }]);
      await this.api.sendMessage(id, message);
    } catch (error) {
      console.error(error);
    } finally {
      ChatStore.elements.delete(id);
    }
  }

  public static async refresh() {
    const chats = await this.api.getAllChats();
    if(chats && chats.length > 0) {
      const currentId = ChatStore.chatID.get();
      const isNotExist = chats.findIndex(chat => chat.id === currentId) < 0;
      if(isNotExist) {
        await ChatSystem.loadChat(chats[0]);
      }
      ChatStore.chats.set(chats);
    } else {
      await ChatSystem.createChat();
      await this.refresh();
    }
  }

  public static async loadChat(session: IChatSession) {
    const { id, title, systemDescription, memoryBalance } = session;
    const messages = await this.api.getMessages(id);
    ChatStore.chatID.set(id);
    ChatStore.title.set(title);
    ChatStore.description.set(systemDescription);
    ChatStore.memoryBalance.set(memoryBalance);
    ChatStore.messages.set(messages.reverse());
    this.hub.joinChat(id);
    const paticipant = await this.api.getParticipants(id);
    ChatStore.userID.set(paticipant.userId);
  }

  public static async createChat(title?: string) {
    title ||= this.defaultChatTitle || `Chat On ${new Date().toLocaleString()}`;
    const newChat = { title: title };
    const result = await this.api.createChat(newChat);
    console.log(result.chatSession);
    return result;
  }

  public static async editChat(chat?: EditableChatSession) {
    const id = ChatStore.chatID.get();
    const editChat = {
      title: chat?.title || ChatStore.title.get(),
      systemDescription: chat?.systemDescription || ChatStore.description.get(),
      memoryBalance: chat?.memoryBalance || ChatStore.memoryBalance.get()
    };
    const result = await this.api.patchChat(id, editChat);
    ChatStore.title.set(result.title);
    ChatStore.description.set(result.systemDescription);
    ChatStore.memoryBalance.set(result.memoryBalance);
  }

  public static async deleteChat(id: string) {
    await this.api.deleteChat(id);
    await this.refresh();
  }

  public static async deleteAllChats() {
    const chats = ChatStore.chats.get();
    await Promise.all(chats.map(chat => this.api.deleteChat(chat.id)));
    await this.refresh();
  }

  

  // Not used yet
  public static async getChat() {
    const id = ChatStore.chatID.get();
    const result = await this.api.getChat(id);
    return result;
  }

  // Not used yet
  public static async getDocument() {
    const id = ChatStore.chatID.get();
    const result = await this.api.getDocument(id);
    return result;
  }

  // Not used yet
  public static async getArchive(id: string) {
    const result = await this.api.getArchive(id);
    return result;
  }

  // Not used yet
  public static async getMemories() {
    const id = ChatStore.chatID.get();
    const result = await this.api.getMemories(id);
    return result;
  }

  // Not used yet
  public static async getParticipants() {
    const id = ChatStore.chatID.get();
    const result = await this.api.getParticipants(id);
    return result;
  }

  // Not used yet
  public static async getInfo() {
    const result = await this.api.getInfo();
    return result;
  }

  // Not used yet
  public static async getAuthConfig() {
    const result = await this.api.getAuthConfig();
    return result;
  }

  

}