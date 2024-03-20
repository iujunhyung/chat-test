import { PlanState } from './Plan';
import { TokenUsage } from './Service';

export enum AuthorRoles {
  User = 0,
  Bot,
  Participant,
}

export enum ChatMessageType {
  Message,
  Plan,
  Document,
}

export enum UserFeedback {
  Unknown,
  Requested,
  Positive,
  Negative,
}

// TODO: ChatArchive 타입 정의!
export interface ChatArchive {
  chatHistory: IChatMessage[];
  chatTitle: string;
  documentEmbeddings: any;
  embeddingConfigurations: any;
  embeddings: any;
  schema: { name: string; version: number };
  systemDescription: string;
}

export interface ChatState {
  id: string;
  title: string;
  systemDescription: string;
  memoryBalance: number;
  users: IChatUser[];
  messages: IChatMessage[];
  enabledHostedPlugins: string[];
  botProfilePicture: string;
  lastUpdatedTimestamp?: number;
  input: string;
  botResponseStatus: string | undefined;
  userDataLoaded: boolean;
  importingDocuments?: string[];
  disabled: boolean; // For labeling a chat has been deleted
  hidden: boolean; // For hiding a chat from the list
}

export interface IChatMessage {
  chatId: string;
  type: ChatMessageType;
  timestamp: number;
  userName: string;
  userId: string;
  content: string;
  id?: string;
  prompt?: string;
  citations?: Citation[];
  authorRole: AuthorRoles;
  debug?: string;
  planState?: PlanState;
  tokenUsage?: TokenUsage;
  userFeedback?: UserFeedback;
}

export interface IChatSession {
  id: string;
  title: string;
  createdOn: string; // 추가
  systemDescription: string;
  safeSystemDescription: string; // 추가
  memoryBalance: number;
  enabledPlugins: string[];
  version: string; // 추가
}

export interface ICreateChatSessionResponse {
  chatSession: IChatSession;
  initialBotMessage: IChatMessage;
}

export interface IChatUser {
  id: string;
  online: boolean;
  fullName: string;
  emailAddress: string;
  photo?: string;
  isTyping: boolean;
}

export interface IChatParticipant {
  userId: string;
  chatId: string;
}

export interface ChatMemorySource {
  id: string;
  chatId: string;
  sourceType: string;
  name: string;
  hyperlink?: string;
  sharedBy: string;
  createdOn: number;
  size: number;
}

export interface Citation {
  link: string;
  sourceName: string;
  snippet: string;
  relevanceScore: number;
}

export interface EditableChatSession {
  title: string;
  systemDescription: string;
  memoryBalance: number;
}
