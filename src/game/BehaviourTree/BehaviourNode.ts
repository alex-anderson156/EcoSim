import { IExecutorNode } from "./ExecutorNode";
import { IExecutionContext } from "./BehaviourTreeExecutor";

 
export interface IBehaviourNode {	
	CreateExecutor(): IExecutorNode;
}


export abstract class BehaviourNode implements IBehaviourNode {

	public abstract CreateExecutor() : IExecutorNode;
}