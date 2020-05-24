import { IBehaviourNode } from "../BehaviourNode";
import { ExecutorNode, IExecutorNode } from "../ExecutorNode";
import { IExecutionContext } from "../BehaviourTreeExecutor";
import { IBehaviourTreeDataContext } from "..";


export abstract class DecoratorNode implements IBehaviourNode {

	protected readonly _ChildNode: IBehaviourNode;

	constructor(childNode: IBehaviourNode) {
		this._ChildNode = childNode;
	}

	public abstract CreateExecutor() : IExecutorNode;
}


export abstract class DecoratorNodeExecutor extends ExecutorNode {

	protected _ChildNode: IBehaviourNode;

	protected _ActiveElement: IExecutorNode;
 
	constructor(childNode: IBehaviourNode) {
		super();
		this._ChildNode = childNode;
	} 

	public Init(executionContext: IExecutionContext, dataContext: IBehaviourTreeDataContext): void {
		super.Init(executionContext, dataContext);
		this._ActiveElement = this._ChildNode.CreateExecutor();
		executionContext.AddExecutable(this._ActiveElement);
	}
}