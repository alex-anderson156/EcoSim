import { BehaviourNode } from "../BehaviourNode";
import { ExecutorNode, IExecutorNode } from "../ExecutorNode"; 
import { IExecutionContext } from "../BehaviourTreeExecutor";
import { IBehaviourTreeDataContext } from "../BehaviourTreeDataContext";


export class PickRandomTargetNode extends BehaviourNode {
	public CreateExecutor(): import("../ExecutorNode").IExecutorNode {
		return new PickRandomTargetExecutorNode();
	}
}

import { Vector3 } from 'THREE';

export class PickRandomTargetExecutorNode extends ExecutorNode {

	private _CurrentEntityPosition: Vector3;
	private _EnableYAxisMovement: boolean = false;

	public Init(executionContext: IExecutionContext, dataContext: IBehaviourTreeDataContext): void {
		super.Init(executionContext, dataContext);

		this._CurrentEntityPosition = dataContext.Entity.Position;
	}

	public Process(dataContext: IBehaviourTreeDataContext): void {
		let moveToPosition: Vector3 = this.GetRandomMoveToVector3(); 		
		dataContext.SetVar('MoveToPosition', moveToPosition);	
		this.Success();
	}



	private GetRandomMoveToVector3() : Vector3{ 
		let r: number = Math.random();
		let x: number = r <= 0.33 ? -1 : (r >= 0.66 ? 1 : 0);
		
		let y: number = 0;
		if (this._EnableYAxisMovement) {
			r = Math.random();
			y = r <= 0.33 ? -1 : (r >= 0.66 ? 1 : 0);
		}

		r = Math.random();
		let z: number = r <= 0.33 ? -1 : (r >= 0.66 ? 1 : 0);

		if(x == 0 && z == 0)
			return this.GetRandomMoveToVector3();

		let moveVector: Vector3 = new Vector3(x, y, z);
		moveVector = moveVector.normalize();
		let newPosition: Vector3 = new Vector3(
			this._CurrentEntityPosition.x + moveVector.x, 
			this._CurrentEntityPosition.y + moveVector.y, 
			this._CurrentEntityPosition.z + moveVector.z
		);

		return newPosition.clamp(new Vector3(0, 0, 0), new Vector3(10 - 1, 10 - 1, 10 - 1));
	}
}