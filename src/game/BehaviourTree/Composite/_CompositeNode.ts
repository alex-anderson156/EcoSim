import { IBehaviourNode } from "../BehaviourNode";
import { IExecutorNode, ExecutorNode } from "../ExecutorNode";


export abstract class CompositeNode implements IBehaviourNode {

	protected readonly _ChildNodes: Array<IBehaviourNode>;

	constructor(...childNodes: Array<IBehaviourNode>) {
		this._ChildNodes = childNodes;
	}

	public abstract CreateExecutor() : IExecutorNode;
}


export abstract class CompositeNodeExecutor extends ExecutorNode {

	protected _ChildNodes: Array<IBehaviourNode>;

	protected _ActiveElement: IExecutorNode;
	protected _ActiveElementIndex: number;

	constructor(...childNodes: Array<IBehaviourNode>) {
		super();
		this._ChildNodes = childNodes;
	} 
 
}