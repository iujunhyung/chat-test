export type SystemType = 'single' | 'multiple';

/**
 * Represents the configuration options for a chat system.
 */
export interface ChatConfig extends APIConfig, HubConfig {
  /**
   * The type of the chat system.
   * @default 'multiple'
   */
  type?: SystemType;

  /**
   * The host of the chat system.
   * @default 'current window location origin'
   */
  host?: string;

  /**
   * The default title for the chat.
   * @default 'Generated Current Date Time'
   */
  defaultChatTitle?: string;
}

export interface APIConfig {
  /**
   * The access token for the chat system.
   * @default 'undefined'
   */
  accessToken?: string;

  /**
   * Indicates whether to add credentials to the chat system.
   * @default false
   */
  addCredential?: boolean;
}

export interface HubConfig {
  
}