import { Group, Vector2, Vector3, Clock} from 'THREE';
import { Component } from "../_Component";
import { AStarFinder } from '../../_Pathfinding/AStar/AStarFinder';
import { World } from '../../World';
import { MoveState } from './MovementComponent';

export class PathfinderMovementComponent extends Component {
	protected _Key: string = 'MovementComponent';

	protected _MoveState: MoveState
	/**
	 * Gets or sets the move state of the component.
	 */
	public get MoveState(): MoveState { return this._MoveState; }
	public set MoveState(value: MoveState) { this._MoveState = value; }
	
	private _MoveSpeed: number
	/**
	 * Gets the speed of the entity in units/millisecond.
	 */
	public get MoveSpeed(): number { return this._MoveSpeed; } 

	private _Clock: Clock;  
	private _World: World;

	private _PathNodes: Array<Vector2>;
	private _CurrentNode: Vector3;

	/**
	 * 
	 * @param moveSpeed 
	 * @param world 
	 */
	constructor(moveSpeed: number, world: World) {
		super();

		this._MoveSpeed = moveSpeed;
		this._World = world;
		this._MoveState = MoveState.IDLE;
		this._Clock = new Clock(); 
 
	}

	public Render(group: Group): void { 
		
	}

	public Update(): void { 
		if(this._MoveState == MoveState.IDLE)
			return;

		if(!this._CurrentNode) {
			this.MoveToNextNode();

			if(!this._CurrentNode) {
				this.Stop();
				return;
			}
		}
 			
		const elapsedFrameTime = this._Clock.getElapsedTime(); 
		if(elapsedFrameTime == 0)
			return; 

		const distanceToMove = this._MoveSpeed / (elapsedFrameTime * 1000);
		const distanceToTarget: number = this._AttachedEntity.Position.distanceTo(this._CurrentNode);

		if(distanceToTarget == 0) {
			this.Stop();
			return;
		}

		const distanceAsPercentageOfTarget: number = distanceToMove / distanceToTarget; 
		const destination: Vector3 = this._AttachedEntity.Position.lerp(this._CurrentNode, distanceAsPercentageOfTarget);

		this._AttachedEntity.Position.copy(destination);  
		if(this._AttachedEntity.Position.distanceToSquared(this._CurrentNode) <= 0.1) {
			this.MoveToNextNode();
			return;
		}	

		
		this._Clock.start();
	}

	protected MoveToNextNode() {

		if(this._PathNodes.length == 0) {
			this.Stop();
			return;
		}

		const target = this._PathNodes.shift();
		this._CurrentNode = new Vector3(target.x, this._AttachedEntity.Position.y, target.y); 
		this._MoveState = MoveState.MOVING;
		this._Clock.start();
	}

	protected Stop() {
		// fini.
		this._MoveState = MoveState.IDLE;  
		this._Clock.stop(); 
	}

	/**
	 * Hops the entity to the specified position.
	 * @param moveTo - The Position to move the entity too.
	 */
	public MoveTo(moveTo: Vector3): void{	
		
		let aStar: AStarFinder = new AStarFinder({
			grid: {
				matrix: this._World.PathfinderGrid
			},
			diagonalAllowed: false,
			includeStartNode: false,
		});
 
		const path = aStar.findPath(this._World.PositionToWorld(this._AttachedEntity.Position), this._World.PositionToWorld(moveTo));

		// No path ?
		if(path.length == 0) 
			return;

		this._PathNodes = [];
		for(let node of path) {
			this._PathNodes.push(new Vector2(node[0], node[1]))
		}

		this.MoveToNextNode();
	}
	
}