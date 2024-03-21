import { 
  observable,
  IObservableValue,
  configure
} from 'mobx';
configure({ 
  enforceActions: 'never'
});

import type { 
  IChatMessage,
  IChatSession
} from '../models/Chat';
import type { 
  ChatMessage 
} from '../components/chat-room/ChatMessage';

/**
 * ChatStore for managing current chat session
 */
export class ChatStore {

  public static userID: IObservableValue<string> = observable.box('');
  public static status: IObservableValue<string> = observable.box('');
  public static chats: IObservableValue<IChatSession[]> = observable.box([]);

  public static chatID: IObservableValue<string> = observable.box('');
  public static title: IObservableValue<string> = observable.box('');
  public static description: IObservableValue<string> = observable.box('');
  public static memoryBalance: IObservableValue<number> = observable.box(0.5);
  public static messages: IObservableValue<IChatMessage[]> = observable.box([]);
  public static elements: Map<string, ChatMessage> = new Map();

}