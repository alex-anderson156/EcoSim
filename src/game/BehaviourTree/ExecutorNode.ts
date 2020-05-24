import { BehaviourNodeState } from "./BehaviourNodeState";
import { IExecutionContext } from "./BehaviourTreeExecutor";
import { IBehaviourTreeDataContext } from "./BehaviourTreeDataContext";

export interface IExecutorNode {
	Init(executionContext: IExecutionContext, dataContext: IBehaviourTreeDataContext): void;

	Process(dataContext: IBehaviourTreeDataContext): void;

	GetState(): BehaviourNodeState;
}


export abstract class ExecutorNode implements IExecutorNode {

	private _State: BehaviourNodeState; 

	protected _ExecutionContext: IExecutionContext


	constructor() {
		this.Running();
	}

	public Init(executionContext: IExecutionContext, dataContext: IBehaviourTreeDataContext): void {
		this._ExecutionContext = executionContext;
		
	}

	public abstract Process(dataContext: IBehaviourTreeDataContext): void;


	public GetState(): BehaviourNodeState {
		return this._State;
	}

	public SetState(state: BehaviourNodeState): void {
		this._State = state;
	}

	public Running(): void {
		this._State = BehaviourNodeState.RUNNING;
	}

	public Success(): void {
		this._State = BehaviourNodeState.SUCCESS;
	}

	public Fail(): void {
		this._State = BehaviourNodeState.FAIL;
	}
}