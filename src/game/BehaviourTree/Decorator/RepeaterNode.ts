import { DecoratorNode, DecoratorNodeExecutor } from "./DecoratorNode";
import { BehaviourNodeState } from "../BehaviourNodeState";
import { IBehaviourNode } from "../BehaviourNode";
import { IExecutorNode } from "../ExecutorNode";

export class RepeaterNode extends DecoratorNode {
	private _MaxIterations: number;

	constructor(childNode: IBehaviourNode, maxIterations: number = -1) {
		super(childNode);
	}

	public CreateExecutor() : IExecutorNode {
		return new RepeaterNodeExecutor(this._ChildNode, this._MaxIterations);
	}
}

export class RepeaterNodeExecutor extends DecoratorNodeExecutor {
	
	private _MaxIterations: number;
	private _CurrentIterations: number;
	
	constructor(childNode: IBehaviourNode, maxIterations: number = -1) {
		super(childNode);
		this._MaxIterations = maxIterations;
	}

	public Process(): void {

		const state: BehaviourNodeState = this._ActiveElement.GetState();
		if (state == BehaviourNodeState.RUNNING) {			
			this.Running();
			return;
		}
		
		if (this._MaxIterations > 0) {
			this._CurrentIterations++;

			if (this._CurrentIterations >= this._MaxIterations) {
				this._ExecutionContext.RemoveExecutable(this._ActiveElement);
				this._ActiveElement = null;
				this.Success();
				return;
			}
		}

		this._ExecutionContext.RemoveExecutable(this._ActiveElement);
		this._ActiveElement = this._ChildNode.CreateExecutor();
		this._ExecutionContext.AddExecutable(this._ActiveElement);
		this.Running();
	}
}