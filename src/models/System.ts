export type SystemType = 'single' | 'multiple';

export interface ChatConfig {
  type?: SystemType;
  host?: string;
  accessToken?: string;
  addCredential?: boolean;
}