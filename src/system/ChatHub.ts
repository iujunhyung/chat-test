import * as signalR from '@microsoft/signalr';
import { observable, IObservableValue } from 'mobx';

import { ChatStore } from './ChatStore';
import {
  ChatState,
  IChatMessage,
  HubConfig
} from '../models';

const enum Methods {
  // SignalR receive method names
  Receive = 'ReceiveMessage',
  Update = 'ReceiveMessageUpdate',
  Joined = 'UserJoined',  
  Status = 'ReceiveBotResponseStatus',
  Edited = 'ChatEdited',
  Deleted = 'ChatDeleted',
  ReceiveUserTyping = 'ReceiveUserTypingState',
  GlobalDocumentUploaded = 'GlobalDocumentUploaded',
  GlobalSiteMaintenance = 'GlobalSiteMaintenance',
  PluginStateChanged = 'PluginStateChanged',

  // SignalR send method names
  AddClient = "AddClientToGroupAsync",
  SendMessage = "SendMessageAsync",
  SendUserTyping = "SendUserTypingStateAsync",
}

export class ChatHub {
  /** ==================== Field ==================== **/

  public ready: IObservableValue<boolean> = observable.box<boolean>(false);
  private readonly endpoint: string = '/messageRelayHub';
  private connection?: signalR.HubConnection;

  /** ==================== Field ==================== **/

  /** ==================== Public Method ==================== **/

  /**
   * Setup SignalR connection
   * @param host - SignalR server host
   */
  public setup = async (config: HubConfig) => {
    if(this.connection) {
      await this.stop(this.connection);
    }
    this.connection = this.create(config.host);
    this.register(this.connection);
    this.start(this.connection);
  }

  /**
   * Join to chat session
   * @param chatId - Chat ID
   */
  public joinChat = (chatId: string) => {
    if(!this.connection) return;
    this.connection.invoke(Methods.AddClient, chatId);
  }

  /**
   * Send ?? message to chat session users except me
   * @param message - Message content
   */
  public sendMessage = (message: string) => {
    if(!this.connection) return;
    const chatId = ChatStore.chatID.get();
    const userId = "";
    this.connection.invoke(Methods.SendMessage, chatId, userId, message);
  }

  /**
   * Send typing status to chat session users
   * @param isTyping - Typing status
   */
  public sendTyping = (isTyping: boolean) => {
    if(!this.connection) return;
    const chatId = ChatStore.chatID.get();
    const userId = "";
    this.connection.invoke(Methods.SendUserTyping, chatId, userId, isTyping);
  }

  /** ==================== Public Method ==================== **/

  /** ==================== Private Method ==================== **/

  // SignalR connection creation
  private create = (host: string) => {
    const url = new URL(this.endpoint, host);
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(url.toString(), {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        logger: signalR.LogLevel.Warning,
      })
      .withAutomaticReconnect()
      .withHubProtocol(new signalR.JsonHubProtocol())
      .configureLogging(signalR.LogLevel.Information)
      .build();
    connection.serverTimeoutInMilliseconds = 60000;
    connection.onclose((error) => {
      const message = 'Connection closed. Try refresh';
      console.log(message, error);
    });
    connection.onreconnecting((error) => {
      const message = 'Connection lost. Reconnecting...';
      console.log(message, error);
    });
    connection.onreconnected((connectionId = '') => {
      const message = 'Connection reestablished. Please refresh';
      console.log(`${message}, id: ${connectionId}`);
    });
    return connection;
  }

  // Registering SignalR event handlers
  private register = (connection: signalR.HubConnection) => {
    // (다른 유저) 또는 (챗봇)에게 메시지 받음(처음)
    connection.on(Methods.Receive, (chatId: string, senderId: string, message: IChatMessage) => {
      console.log('receive', chatId, senderId, message);
      ChatStore.messages.set([...ChatStore.messages.get(), message]);
    });
    // 챗봇의 메시지가 지속적으로 들어오는 메서드
    connection.on(Methods.Update, (message: IChatMessage) => {
      const { id, content } = message;
      if(!id) return;
      const element = ChatStore.elements.get(id);
      if(!element) return;
      element.content = content;
    });
    // 다른 유저가 채팅세션에 들어왔을 때 ?????
    connection.on(Methods.Joined, (chatId: string, userId: string) => {
      console.log('joined', chatId, userId);
    });
    // 다른 유저의 인풋 타이핑 상태를 받는 메서드
    connection.on(Methods.ReceiveUserTyping, (chatId: string, userId: string, isTyping: boolean) => {
      console.log('typing', chatId, userId, isTyping);
    });
    // 챗봇의 상태를 받는 메서드
    connection.on(Methods.Status, (chatId: string, status: string) => {
      ChatStore.status.set(status);
      console.log('status', chatId, status);
    });
    // 전역으로 파일이 업로드되었을 때
    connection.on(Methods.GlobalDocumentUploaded, (fileNames: string, userName: string) => {
      console.log('document uploaded', fileNames, userName);
    });
    // 채팅세션이 수정되었을 때
    connection.on(Methods.Edited, (chat: ChatState) => {
      const { id, title } = chat;
      console.log('edited', id, title);
    });
    // 채팅세션이 삭제되었을 때
    connection.on(Methods.Deleted, (chatId: string, userId: string) => {
      console.log('deleted', chatId, userId);
    });
    // ??? 필요없어보임
    connection.on(Methods.GlobalSiteMaintenance, () => {
      // store.dispatch(setMaintenance(true));
    });
    // ???
    connection.on(Methods.PluginStateChanged, (chatId: string, pluginName: string, pluginState: boolean) => {
      console.log('plugin state', chatId, pluginName, pluginState);
    });
  }

  // Starting SignalR connection
  private start = async (connection: signalR.HubConnection) => {
    this.ready.set(false);
    try {
      await connection.start();
      this.ready.set(true);
    } catch (error) {
      console.error(error);
    }
  }

  // Stopping SignalR connection
  private stop = async (connection: signalR.HubConnection) => {
    await connection.stop();
    this.ready.set(false);
  }

  /** ==================== Private Method ==================== **/
  
}