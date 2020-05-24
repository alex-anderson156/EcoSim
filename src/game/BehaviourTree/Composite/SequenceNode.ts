import { BehaviourNodeState } from "../BehaviourNodeState"; 
import { IExecutorNode } from "../ExecutorNode";
import { CompositeNode, CompositeNodeExecutor } from "./_CompositeNode";
import { IExecutionContext } from "../BehaviourTreeExecutor";
import { IBehaviourTreeDataContext } from "../BehaviourTreeDataContext";

export class SequenceNode extends CompositeNode {

	public CreateExecutor() : IExecutorNode {
		return new SequenceNodeExecutor(...this._ChildNodes);
	}
}

export class SequenceNodeExecutor extends CompositeNodeExecutor {
 
	public Init(executionContext: IExecutionContext, dataContext: IBehaviourTreeDataContext): void {
		super.Init(executionContext, dataContext);
		this._ActiveElementIndex = 0;
		this._ActiveElement = this._ChildNodes[this._ActiveElementIndex].CreateExecutor();
		this._ExecutionContext.AddExecutable(this._ActiveElement);
	}
	
	public Process(dataContext: IBehaviourTreeDataContext): void { 
		const state: BehaviourNodeState = this._ActiveElement.GetState();
		if (state == BehaviourNodeState.RUNNING) {
			this.Running();
			return;
		}

		if(state == BehaviourNodeState.FAIL) {
			this._ExecutionContext.RemoveExecutable(this._ActiveElement);
			this._ActiveElement = null;
			this.Fail();
			return;
		}
					
		if(this._ActiveElementIndex >= (this._ChildNodes.length - 1)){
			this._ExecutionContext.RemoveExecutable(this._ActiveElement);
			this._ActiveElement = null;
			this.Success();
			return;
		}

		this._ExecutionContext.RemoveExecutable(this._ActiveElement);
		this._ActiveElementIndex++;
		this._ActiveElement = this._ChildNodes[this._ActiveElementIndex].CreateExecutor();
		this._ExecutionContext.AddExecutable(this._ActiveElement);
		this.Running();
	}
}