export interface IPlanInput {
	Key: string;
	Value: string;
}

export enum PlanState {
	NoOp,
	Approved,
	Rejected,
	Derived,
	PlanApprovalRequired,
	Disabled,
}

export enum PlanType {
	Action, // single-step
	Sequential, // multi-step
	Stepwise, // MRKL style planning
}

export interface Plan {
	state: IPlanInput[];
	steps: Plan[];
	parameters: IPlanInput[];
	outputs: string[];
	hasNextStep: boolean;
	nextStepIndex: number;
	name: string;
	skill_name: string;
	description: string;
	isSemantic: boolean;
	isSensitive: boolean;
	trustServiceInstance: any;
	requestSettings: any;
	index: number;
}

export interface ProposedPlan {
	proposedPlan: Plan;
	type: PlanType;
	state: PlanState;
	originalUserInput?: string;
	userIntent?: string;
	generatedPlanMessageId?: string;
}

export interface PlanExecutionMetadata {
	stepsTaken: string;
	timeTaken: string;
	functionsUsed: string;
	plannerType: PlanType;
}