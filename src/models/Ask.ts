import { IChatMessage } from './Chat';

export interface IAsk {
  input: string;
  variables?: IAskVariables[];
}

export interface IAskVariables {
  key: string;
  value: string;
}

export interface IAskResult {
  message: IChatMessage;
  variables: ContextVariable[];
}

export interface ContextVariable {
  key: string;
  value: string;
}