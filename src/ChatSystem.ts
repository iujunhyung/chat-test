import { observable, IObservableValue } from "mobx";
import { ChatAPI } from "./api/ChatAPI";
import { ChatHub } from "./hub/ChatHub";
import { ChatStore } from "./store/ChatStore";

import type { 
  ChatConfig,
  SystemType
} from "./models/System";
import type { 
  IChatSession 
} from "./models/Chat";

export class ChatSystem {
  
  public static type: IObservableValue<SystemType> = observable.box<SystemType>('multiple');
  public static api: ChatAPI = new ChatAPI();
  public static hub: ChatHub = new ChatHub();

  public static setup(config: ChatConfig) {
    const { type, host } = config;
    this.type.set(type || 'multiple');
    this.api.setup(host || `${window.location.origin}`);
    this.hub.setup(host || `${window.location.origin}`);
  }

  public static async getInfo() {
    const result = await this.api.getInfo();
    return result;
  }

  public static async getAuthConfig() {
    const result = await this.api.getAuthConfig();
    return result;
  }

  public static async sendMessage(message: string) {
    const id = ChatStore.chatID.get();
    const result = await this.api.sendMessage(id, message);
    return result;
  }

  public static async getAllChats() {
    const result = await this.api.getAllChats();
    return result;
  }

  public static async loadChat(session: IChatSession) {
    const { id, title, systemDescription, memoryBalance } = session;
    const history = await this.api.getMessages(id);
    ChatStore.chatID.set(id);
    ChatStore.title.set(title);
    ChatStore.description.set(systemDescription);
    ChatStore.memoryBalance.set(memoryBalance);
    ChatStore.history.set(history);
  }

  public static async getChat() {
    const id = ChatStore.chatID.get();
    const result = await this.api.getChat(id);
    return result;
  }

  public static joinChat(id: string) {
    this.hub.joinChat(id);
  }

  public static async createChat(title?: string) {
    title ||= `@Generated ${Date.now()}`;
    const newChat = { title: title };
    const result = await this.api.createChat(newChat);
    return result;
  }

  // TODO: 입력 구현!!
  public static async editChat(title?: string) {
    const id = ChatStore.chatID.get();
    const body = { title: 'This is a Test!!' };
    const result = await this.api.patchChat(id, body);
    return result;
  }

  public static async deleteChat(id: string) {
    await this.api.deleteChat(id);
  }

  public static async getDocument() {
    const id = ChatStore.chatID.get();
    const result = await this.api.getDocument(id);
    return result;
  }

  public static async getArchive(id: string) {
    const result = await this.api.getArchive(id);
    return result;
  }

  public static async getMemories() {
    const id = ChatStore.chatID.get();
    const result = await this.api.getMemories(id);
    return result;
  }

  public static async getParticipants() {
    const id = ChatStore.chatID.get();
    const result = await this.api.getParticipants(id);
    return result;
  }

}