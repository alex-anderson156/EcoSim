import { Group, Vector2, Vector3, Clock} from 'THREE';
import { Component } from "../_Component";
import { AStarFinder } from '../../_Pathfinding/AStar/AStarFinder';
import { World } from '../../World';
import { MoveState, MovementComponent, MoveToResult } from './MovementComponent';

import * as _ from 'lodash';


export class PathfinderMovementComponent extends MovementComponent {
	protected _Key: string = 'MovementComponent';
 
	private _World: World;

	private _PathNodes: Array<Vector2>;
	private _FinalDestination: Vector3;

	/**
	 * 
	 * @param moveSpeed 
	 * @param world 
	 */
	constructor(moveSpeed: number, world: World) {
		super(moveSpeed);
 
		this._World = world;  
 
	}

	public Render(group: Group): void { 
		
	}

	public Update(): void { 
		if(this._MoveState == MoveState.IDLE)
			return;
 
		// transitions us ever closer to the goal
		super.Update(); 
	}
 
	protected MoveToNextNode(): boolean {

		if(this._PathNodes.length == 0) {
			// No Final destination, we reached our target.
			if(this._FinalDestination == null) {
				this._MoveTarget = null;
				super.Stop();
				return false;
			}

			return super.MoveTo(this._FinalDestination) == MoveToResult.PathFound ? true : false;
		}
		else {
			const target = this._PathNodes.shift();
			this._MoveTarget = new Vector3(target.x, this._AttachedEntity.Position.y, target.y); 			
			this._AttachedEntity.SceneGroup.lookAt(this._MoveTarget);
			this._MoveState = MoveState.MOVING;
			this._Clock.start();
			return true;
		}	
	}

	protected Stop() {
		if(!this._MoveTarget) {
			if(!this.MoveToNextNode()) {
				super.Stop();
			}
		} 
	}

	/**
	 * Hops the entity to the specified position.
	 * @param moveTo - The Position to move the entity too.
	 */
	public MoveTo(moveTo: Vector3, options: IPathfinderOptions = {}): MoveToResult {	

		if(options.noPathfinding || this._AttachedEntity.Position.distanceToSquared(moveTo) <= 1) {
			return super.MoveTo(moveTo);
		} 
		
		let aStar: AStarFinder = new AStarFinder({
			grid: {
				matrix: this._World.PathfinderGrid
			},

			includeStartNode: false,
			diagonalAllowed: options?.allowDiagonals == null ? true : options.allowDiagonals,			
			includeEndNode: options?.includeEndNode == null ? true : options.includeEndNode
		});
 
		const path = aStar.findPath(this._World.PositionToWorld(this._AttachedEntity.Position), this._World.PositionToWorld(moveTo));

		// No path ?
		if(path.length == 0) 
			return MoveToResult.NoPath;

		this._PathNodes = [];
		for(let node of path) {
			this._PathNodes.push(new Vector2(node[0], node[1]))
		}

		const moveToASWorld: Vector2 = new Vector2(moveTo.x, moveTo.z);
		this._FinalDestination = null;
		if(!_.last(this._PathNodes).equals(moveToASWorld)){
			this._FinalDestination = moveTo; 
		}

		return this.MoveToNextNode() ? MoveToResult.PathFound : MoveToResult.NoPath;
	}	
}


export interface IPathfinderOptions {
	allowDiagonals?: boolean,
	includeEndNode?: boolean
	noPathfinding?: boolean
}