import { Group, Vector3, Clock} from 'THREE';
import { Component } from "../_Component";

export class MovementComponent extends Component {
	protected _Key: string = 'MovementComponent';

	protected _MoveState: MoveState
	/**
	 * Gets or sets the move state of the component.
	 */
	public get MoveState(): MoveState { return this._MoveState; }
	public set MoveState(value: MoveState) { this._MoveState = value; }
	
	protected _MoveSpeed: number
	/**
	 * Gets the speed of the entity in units/millisecond.
	 */
	public get MoveSpeed(): number { return this._MoveSpeed; } 

	protected _Clock: Clock;  
	protected _MoveTarget: Vector3;   

	constructor(moveSpeed: number) {
		super();

		this._MoveSpeed = moveSpeed;
		this._MoveState = MoveState.IDLE;
		this._Clock = new Clock(); 
 
	}

	public Render(group: Group): void { 
		
	}

	public Update(): void { 
		if(this._MoveState == MoveState.IDLE)
			return;

		const elapsedFrameTime = this._Clock.getElapsedTime(); 
		if (elapsedFrameTime == 0)
			return; 

		const distanceToMove = this._MoveSpeed / (elapsedFrameTime * 1000);
		const distanceToTarget: number = this._AttachedEntity.Position.distanceTo(this._MoveTarget);

		if (distanceToTarget <= 0.1) {
			this._MoveTarget = null;
			this.Stop();
			return;
		}

		const distanceAsPercentageOfTarget: number = distanceToMove / distanceToTarget; 
		const destination: Vector3 = this._AttachedEntity.Position.lerp(this._MoveTarget, distanceAsPercentageOfTarget);

		this._AttachedEntity.Position.copy(destination);  
		if (this._AttachedEntity.Position.distanceToSquared(this._MoveTarget) <= 0.1) {
			this._MoveTarget = null;
			this.Stop();
			return;
		}	
 
		//
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
	 * @returns true if a path has been found and we are moving, false otherwise.
	 */
	public MoveTo(moveTo: Vector3): MoveToResult {			

		if(this._AttachedEntity.Position.distanceToSquared(moveTo) <= 0.1) {
			return MoveToResult.NoMovementRequired; // we are already close enough to satisfy the movement component, return false, we didnt need to find a path
		}

		this._MoveTarget = moveTo;		
		this._AttachedEntity.SceneGroup.lookAt(this._MoveTarget);

		this._MoveState = MoveState.MOVING;
		this._Clock.start();
		return MoveToResult.PathFound;
	}
	
}

export enum MoveState {
	IDLE, // I have no Instructions.
	MOVING, // Moving
}

export enum MoveToResult {
	PathFound,
	NoPath,
	NoMovementRequired
}