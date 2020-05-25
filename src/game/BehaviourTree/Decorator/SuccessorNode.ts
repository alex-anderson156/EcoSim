import { DecoratorNode, DecoratorNodeExecutor } from "./DecoratorNode";
import { BehaviourNodeState } from "../BehaviourNodeState";
import { IBehaviourNode } from "../BehaviourNode";
import { IExecutorNode } from "../ExecutorNode";

export class SuccessorNode extends DecoratorNode {
	 
	public CreateExecutor() : IExecutorNode {
		return new SuccessorNodeExecutor(this._ChildNode);
	}
}

export class SuccessorNodeExecutor extends DecoratorNodeExecutor {
	 
	public Process(): void {

		const state: BehaviourNodeState = this._ActiveElement.GetState();
		if (state == BehaviourNodeState.RUNNING) {			
			this.Running();
			return;
		}
		
		this._ExecutionContext.RemoveExecutable(this._ActiveElement);
		this._ActiveElement = null;
		this.Success();
	}
}