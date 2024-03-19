import { PlanExecutionMetadata } from './Plan';

export interface BotResponsePrompt {
  systemPersona: string;
  audience: string;
  userIntent: string;
  chatMemories: string;
  chatHistory: string;
  externalInformation: string;
  metaPromptTemplate: ContextMessage[];
  rawView: any;
}

export const PromptSectionsNameMap: Record<string, string> = {
  systemPersona: 'System Persona',
  audience: 'Audience',
  userIntent: 'User Intent',
  chatMemories: 'Chat Memories',
  chatHistory: 'Chat History',
  externalInformation: 'Planner Results',
};

export interface DependencyDetails {
  context: string | PlanExecutionMetadata;
  result: string;
}

enum AuthorRoles {
  System = 'System',
  User = 'User',
  Assistant = 'Assistant',
  Tool = 'Tool',
  Function = 'Function',
}

interface ContextMessage {
  Role: {
    Label: AuthorRoles;
  };
  Content: string;
}
