export interface MemoryStore {
  types: string[];
  selectedType: string;
}

export interface HostedPlugin {
  name: string;
  manifestDomain: string;
}

export interface ServiceInfo {
  memoryStore: MemoryStore;
  availablePlugins: HostedPlugin[];
  version: string;
  isContentSafetyEnabled: boolean;
}

export interface StepwiseStep {
  thought: string;
  action?: string;
  action_variables?: Record<string, string>;
  observation?: string;
  final_answer?: string;
  original_response: string;
}

export type TokenUsage = Record<string, number | undefined>;

export type TokenUsageView = Record<string, TokenUsageViewDetails>;

export interface TokenUsageViewDetails {
  usageCount: number;
  legendLabel: string;
  color: string;
}

export interface FunctionDetails {
  usageCount: number;
  legendLabel: string;
  color?: string;
}

export const TokenUsageFunctionNameMap: Record<string, string> = {
  audienceExtraction: 'Audience Extraction',
  userIntentExtraction: 'User Intent Extraction',
  metaPromptTemplate: 'Meta Prompt Template',
  responseCompletion: 'Response Completion',
  workingMemoryExtraction: 'Working Memory Generation',
  longTermMemoryExtraction: 'Long Term Memory Generation',
};
