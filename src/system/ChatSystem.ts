import { observable, IObservableValue } from "mobx";
import { ChatAPI } from "./ChatAPI";
import { ChatHub } from "./ChatHub";
import { ChatStore } from "./ChatStore";

import type { 
  ChatConfig,
  SystemType
} from "../models/System";
import type { 
  IChatSession 
} from "../models/Chat";

export class ChatSystem {
  
  public static type: IObservableValue<SystemType> = observable.box<SystemType>('multiple');
  public static defaultChatTitle: string = `@Generated ${Date.now().toLocaleString()}`;
  public static api: ChatAPI = new ChatAPI();
  public static hub: ChatHub = new ChatHub();

  public static setup(config: ChatConfig) {
    this.type.set(config.type || 'multiple');
    this.defaultChatTitle = config.defaultChatTitle || this.defaultChatTitle
    this.api.setup({
      host: config.host,
      apiAccessToken: config.apiAccessToken,
      apiAddCredential: config.apiAddCredential
    });
    this.hub.setup({
      host: config.host
    });
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

  public static async getAllChats() {
    const result = await this.api.getAllChats();
    return result;
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
    title ||= this.defaultChatTitle;
    const newChat = { title: title };
    const result = await this.api.createChat(newChat);
    console.log(result.chatSession);
    return result;
  }

  // TODO: 입력 구현!!
  public static async editChat(title?: string) {
    const id = ChatStore.chatID.get();
    const body = { title: title };
    const result = await this.api.patchChat(id, body);
    return result;
  }

  public static async deleteChat(id: string) {
    await this.api.deleteChat(id);
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