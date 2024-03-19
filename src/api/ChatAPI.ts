import type { 
  IAsk, 
  IAskResult,
  ServiceInfo,
  AuthConfig,
  IChatSession,
  IChatMessage,
  ICreateChatSessionResponse,
  IChatParticipant,
  ChatArchive
} from "../models";
import { ChatMessageType } from "../models/Chat";

type HTTPMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH';

export class ChatAPI {
  /** ==================== Field ==================== **/
  
  private host: string = window.location.origin;

  /** ==================== Field ==================== **/

  /** ==================== Public Method ==================== **/

  public setup = (host: string) => {
    this.host = host;
  }

  public async getInfo() {
    const result = await this.get<ServiceInfo>('info');
    console.log('info', result);
    return result;
  }

  public async getAuthConfig() {
    const result = await this.get<AuthConfig>('authconfig');
    console.log('authconfig', result);
    return result;
  }

  public async sendMessage(id: string, message: string) {
    const body: IAsk =  {
      input: `${message}`,
      variables: [
        { key: 'chatId',  value: `${id}` },
        { key: 'messageType', value: `${ChatMessageType.Message}` }
      ]
    };
    const result = await this.post<IAskResult>(`chats/${id}/messages`, body);
    console.log('sendMessage', result);
    return result;
  }

  public async getMessages(id: string) {
    const result = await this.get<IChatMessage[]>(`chats/${id}/messages`);
    console.log('getMessages', result);
    return result;
  }

  public async getAllChats() {
    const result = await this.get<IChatSession[]>('chats');
    console.log('chats', result);
    return result;
  }

  public async getChat(id: string) {
    const result = await this.get<IChatSession>(`chats/${id}`);
    console.log('chat', result);
    return result;
  }

  public async createChat(body: any) {
    const result = await this.post<ICreateChatSessionResponse>(`chats`, body);
    console.log('patchChat', result);
    return result;
  }

  public async patchChat(id: string, body: any) {
    const result = await this.patch<IChatSession>(`chats/${id}`, body);
    console.log('patchChat', result);
    return result;
  }

  public async deleteChat(id: string) {
    await this.delete(`chats/${id}`);
  }

  public async getDocument(id: string) {
    const result = await this.get<any>(`chats/${id}/documents`);
    console.log('document', result);
    return result;
  }

  public async getArchive(id: string) {
    const result = await this.get<ChatArchive>(`chats/${id}/archive`);
    console.log('archive', result);
    return result;
  }

  public async getMemories(id: string) {
    const type = 'LongTermMemory'; // WorkingMemory, LongTermMemory
    const result = await this.get<any>(`chats/${id}/memories?type=${type}`);
    console.log('memories', result);
    return result;
  }

  public async getParticipants(id: string) {
    const result = await this.get<IChatParticipant>(`chats/${id}/participants`);
    console.log('participants', result);
    return result;
  }

  /** ==================== Public Method ==================== **/

  /** ==================== Private Method ==================== **/

  private async get<T>(url: string): Promise<T> {
    return await this.request('GET', url);
  }

  private post = async <T>(url: string, body: any): Promise<T> => {
    return await this.request('POST', url, body);
  }

  private delete = async <T>(url: string): Promise<T> => {
    return await this.request('DELETE', url);
  }

  private patch = async <T>(url: string, body: any): Promise<T> => {
    return await this.request('PATCH', url, body);
  }

  private request = async <T>(method: HTTPMethod, url: string, body?: any): Promise<T> => {
    if(!this.host) throw new Error('Host not set');
    try {
      const request = new URL(url, this.host);
      const headers = new Headers();
      const content = body ? JSON.stringify(body) : undefined;
      if(content) {
        headers.set('Content-Type', 'application/json');
      }
      const response = await fetch(request, {
        method,
        headers,
        body: content
      });

      if (response.ok) {
        if (response.status === 204) {
          return {} as T;
        } else {
          return await response.json();
        }
      } else if (response.status === 401) {
        throw new Error('Unauthorized');
      } else if (response.status === 403) {
        throw new Error('Forbidden');
      } else if (response.status === 404) {
        throw new Error('Not Found');
      } else if (response.status === 500) {
        throw new Error('Internal Server Error');
      } else if (response.status === 504) {
        throw new Error('Gateway Timeout');
      } else {
        throw new Error('Unknown Error');
      }
    } catch (e: any) {
      const networkMsg = e instanceof TypeError ? 'Is the backend server running?' : '';
      throw Object.assign(new Error(`${e as string} ${networkMsg}`));
    }
  }

  /** ==================== Private Method ==================== **/

}