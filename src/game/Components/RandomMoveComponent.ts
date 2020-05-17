import { Component } from "./_Component";

import { Group, Vector2, Vector3, Clock, BoxGeometry, Mesh, Line, MeshBasicMaterial, Color} from 'THREE';
import { MovementComponent } from "./MovementComponent";
import { World } from "../World";


export class RandomMoveComponent extends Component {
	protected _Key: string = 'RandomMoveComponent';

	private _World: World;
	private _Clock: Clock;


	private _IsStuck: boolean;

	private _PositionIndicator: Mesh;

	constructor(world: World) {
		super();

		this._World = world;
		this._Clock = new Clock();
		this._Clock.start();
	}

	public Render(group: Group): void { 
		
		const positionBox: BoxGeometry = new BoxGeometry(1, 1, 1);
		const positionBoxMat: MeshBasicMaterial = new MeshBasicMaterial({color: new Color(0x00F)}); 
		this._PositionIndicator = new Mesh(positionBox, positionBoxMat);
		this._PositionIndicator.scale.set(.1, .1, .1);
		group.add(this._PositionIndicator);

		//const positionLine: Line = new Line()
		//const positionLineMat: MeshBasicMaterial = new MeshBasicMaterial({color: new Color(0xFFF)});
		//const positionLineMesh: Mesh = new Mesh(positionBox, positionBoxMat);

	}

	public Update(): void {
		let movementComponent: MovementComponent = this._AttachedEntity.GetComponent<MovementComponent>('MovementComponent');
 
		if(this._IsStuck)
			return;
		
		if(this._Clock.getElapsedTime() >= 1) {

			let iterationCount: number = 0; // 15
			for(iterationCount = 0; iterationCount <= 15 ;iterationCount++){
				let moveToPosition: Vector3 = this.GetRandomMoveToVector3();

				// Move this._PositionalIndicator to the point relative to me.
				let relativePosition: Vector3 = new Vector3().copy(moveToPosition).sub(this._AttachedEntity.Position);
				this._PositionIndicator.position.copy(relativePosition);
 
				//query the world to get the tile data at that position;
				let mapData = this._World.GetTileData(Math.round(moveToPosition.x), Math.round(moveToPosition.z));

				if(mapData.Region.IsPassable){
					movementComponent.MoveTo(moveToPosition);			
					this._Clock.start();
					break;		 
				}
			} 

			if(iterationCount >= 15) {
				// if we get here. the creature is stuck and cant move.
				console.log('This Entity is stuck and cant go anywhere. ', this._AttachedEntity);
				this._IsStuck = true;
			}
		}
	}


	private GetRandomMoveToVector3() : Vector3{ 
		let r: number = Math.random();
		let x: number = r <= 0.33 ? -1 : (r >= 0.66 ? 1 : 0);
		
		r = Math.random();
		let y: number = r <= 0.33 ? -1 : (r >= 0.66 ? 1 : 0);

		if(x == 0 && y == 0)
			return this.GetRandomMoveToVector3();

		let moveVector: Vector2 = new Vector2(x, y);
		moveVector = moveVector.normalize();

		console.log(moveVector);
		let newPosition: Vector3 = new Vector3(this._AttachedEntity.Position.x + moveVector.x, this._AttachedEntity.Position.y, this._AttachedEntity.Position.z + moveVector.y);

		return newPosition.clamp(new Vector3(0, this._AttachedEntity.Position.y, 0), new Vector3(this._World.WorldWidth - 1, this._AttachedEntity.Position.y, this._World.WorldDepth - 1));
	}
	
}