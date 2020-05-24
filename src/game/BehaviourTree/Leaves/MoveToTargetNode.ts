import { BehaviourNode } from "../BehaviourNode";
import { ExecutorNode, IExecutorNode } from "../ExecutorNode"; 
import { IExecutionContext } from "../BehaviourTreeExecutor";
import { IBehaviourTreeDataContext } from "../BehaviourTreeDataContext";
 
export class MoveToTargetNode extends BehaviourNode { 
	public CreateExecutor(): IExecutorNode {
		return new MoveToTargetNodeExecutor();
	} 
}

import { Vector3 } from 'THREE';
import { MovementComponent, MoveState } from "../../Components";

export class MoveToTargetNodeExecutor extends ExecutorNode {
  
	public Init(executionContext: IExecutionContext, dataContext: IBehaviourTreeDataContext): void {
		super.Init(executionContext, dataContext);

		const target: Vector3 = dataContext.GetVar<Vector3>('MoveToPosition');
		if(!target)
			throw 'No Target to Move to ...';

		dataContext.ClearVar('MoveToPosition');
		const moveComp: MovementComponent = dataContext.Entity.GetComponent<MovementComponent>("MovementComponent");

		if(!moveComp)
			throw 'Given Entity Lacks a Movement Component; But has been asked to move!';

		moveComp.MoveTo(target);
	}

	public Process(dataContext: IBehaviourTreeDataContext): void {
 
		const moveComp: MovementComponent = dataContext.Entity.GetComponent<MovementComponent>("MovementComponent");
		moveComp.Update();

		if (moveComp.MoveState == MoveState.MOVING) {
			this.Running();
			return;
		}

		this.Success();
	} 
}