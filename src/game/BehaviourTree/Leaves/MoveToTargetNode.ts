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
import { MovementComponent, MoveState, MoveToResult } from "../../Components";

export class MoveToTargetNodeExecutor extends ExecutorNode {

	private _HasFoundPath: boolean
  
	public Init(executionContext: IExecutionContext, dataContext: IBehaviourTreeDataContext): void {
		super.Init(executionContext, dataContext);

		const target: Vector3 = dataContext.GetVar<Vector3>('MoveToPosition');
		if(!target)
			throw 'No Target to Move to ...';

		dataContext.ClearVar('MoveToPosition');
		const moveComp: MovementComponent = dataContext.Entity.GetComponent<MovementComponent>("MovementComponent");

		if(!moveComp)
			throw 'Given Entity Lacks a Movement Component; But has been asked to move!';

		const result = moveComp.MoveTo(target);
		console.log('Pathing Result', this._HasFoundPath);

		this._HasFoundPath = result != MoveToResult.NoPath;
	}

	public Process(dataContext: IBehaviourTreeDataContext): void {

		if(!this._HasFoundPath) {
			this.Fail();
			return;
		}
 
		const moveComp: MovementComponent = dataContext.Entity.GetComponent<MovementComponent>("MovementComponent");
		moveComp.Update();

		if (moveComp.MoveState == MoveState.MOVING) {
			this.Running();
			return;
		}

		this.Success();
	} 
}