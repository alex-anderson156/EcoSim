import { BehaviourNode } from "../BehaviourNode";
import { ExecutorNode, IExecutorNode } from "../ExecutorNode"; 
import { IExecutionContext } from "../BehaviourTreeExecutor";
import { IBehaviourTreeDataContext } from "../BehaviourTreeDataContext";


export class PickRandomTargetNode extends BehaviourNode {

	private readonly _World: World;

	constructor(world: World) {
		super();
		this._World = world;
	}

	public CreateExecutor(): IExecutorNode {
		return new PickRandomTargetExecutorNode(this._World);
	}
}

import { Vector3 } from 'THREE';
import { World } from "../../World";

export class PickRandomTargetExecutorNode extends ExecutorNode {

	private _CurrentEntityPosition: Vector3;
	private _EnableYAxisMovement: boolean = false;

	private readonly _World: World;

	constructor(world: World) {
		super();
		this._World = world;
	}


	public Init(executionContext: IExecutionContext, dataContext: IBehaviourTreeDataContext): void {
		super.Init(executionContext, dataContext);

		this._CurrentEntityPosition = dataContext.Entity.Position;
	}

	public Process(dataContext: IBehaviourTreeDataContext): void {
		let moveToPosition: Vector3 = this.GetRandomMoveToVector3(); 	
		
		let mapData = this._World.GetTileData(Math.round(moveToPosition.x), Math.round(moveToPosition.z));  
		if (this._EnableYAxisMovement || mapData.Region.IsPassable) { 
			dataContext.SetVar('MoveToPosition', moveToPosition);	
			this.Success();
			return;		  
		} 
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

		return newPosition.clamp(new Vector3(0, 0, 0), new Vector3(this._World.WorldWidth - 1, this._World.WorldMaxHeight - 1, this._World.WorldDepth - 1));
	}
}