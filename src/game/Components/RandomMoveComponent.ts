import { Component } from "./_Component";

import { Group, Vector3, Clock } from 'THREE';
import { MovementComponent, MoveState } from "./MovementComponent";
import { World } from "../World";


export class RandomMoveComponent extends Component {
	protected _Key: string = 'RandomMoveComponent';

	private _World: World;
	private _Clock: Clock;
 
	private _IsStuck: boolean; 

	private _EnableYAxisMovement: boolean;

	constructor(world: World, enableYAxisMovement: boolean = false) {
		super();

		this._World = world;
		this._EnableYAxisMovement = enableYAxisMovement;

		this._Clock = new Clock();
		this._Clock.start();
	}

	public Render(group: Group): void { 
		  
	}

	public Update(): void {
		let movementComponent: MovementComponent = this._AttachedEntity.GetComponent<MovementComponent>('MovementComponent');
 
		if(this._IsStuck || movementComponent.MoveState == MoveState.MOVING)
			return;
		
		if(this._Clock.getElapsedTime() >= 2) {

			let iterationCount: number = 0; // 15
			for(iterationCount = 0; iterationCount <= 15 ;iterationCount++){
				let moveToPosition: Vector3 = this.GetRandomMoveToVector3();
 
				//query the world to get the tile data at that position;
				let mapData = this._World.GetTileData(Math.round(moveToPosition.x), Math.round(moveToPosition.z)); 
				if (this._EnableYAxisMovement || mapData.Region.IsPassable) {
					movementComponent.MoveTo(moveToPosition);			
					this._Clock.start();
					break;		 
				}
			} 

			if(iterationCount >= 15) {
				// if we get here. the creature is stuck and cant move.
				console.log('This Entity is stuck and cant go anywhere. ', this._AttachedEntity);
				this._IsStuck = true;
				this._Clock.stop();
			}
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

		console.log(moveVector);
		let newPosition: Vector3 = new Vector3(this._AttachedEntity.Position.x + moveVector.x, this._AttachedEntity.Position.y + moveVector.y, this._AttachedEntity.Position.z + moveVector.z);

		return newPosition.clamp(new Vector3(0, 0, 0), new Vector3(this._World.WorldWidth - 1, this._World.WorldMaxHeight - 1, this._World.WorldDepth - 1));
	}
	
}