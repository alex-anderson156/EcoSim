import { Group, Vector3, Clock} from 'THREE';
import { Component } from "./_Component";

export class MovementComponent extends Component {
	protected _Key: string = 'MovementComponent';

	protected _MoveState: MoveState;
	protected _MoveSpeed: number; // the speed in units/millisecond

	private _Clock: Clock;  
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

		if(elapsedFrameTime == 0) {
			return;
		}

		const distanceToMove = this._MoveSpeed / (elapsedFrameTime * 1000);
		const distanceToTarget: number = this._AttachedEntity.Position.distanceTo(this._MoveTarget);

		if(distanceToTarget == 0) {
			this.Stop();
			return;
		}

		const distanceAsPercentageOfTarget: number = distanceToMove / distanceToTarget; 
		const destination: Vector3 = this._AttachedEntity.Position.lerp(this._MoveTarget, distanceAsPercentageOfTarget);

		this._AttachedEntity.Position.copy(destination); 

		if(this._AttachedEntity.Position.distanceToSquared(this._MoveTarget) <= 0.1) {
			this.Stop();
			return;
		}	

		//
		this._Clock.start();
	}

	protected Stop() {
		// fini.
		this._MoveState = MoveState.IDLE; 
		this._MoveTarget = null;
		this._Clock.stop(); 
	}

	/**
	 * Hops the entity to the specified position.
	 * @param moveTo - The Position to move the entity too.
	 */
	public MoveTo(moveTo: Vector3): void{				 
		this._MoveTarget = moveTo;
		this._MoveState = MoveState.HOPPING;
		this._Clock.start();
	}
	
}

export class HopMovementComponent extends MovementComponent {

	protected _HopClock: Clock;  
	
	constructor(moveSpeed: number) {
		super(moveSpeed);
		this._HopClock = new Clock();
		this._HopClock.start();
	}

	public Update(){
		super.Update();

		if(this._MoveState == MoveState.IDLE)
			return; 

		let y: number = (Math.sin(10 * this._HopClock.getElapsedTime()) + 1) / 6;
		this._AttachedEntity.Position.y = 1.15 + y;
	}

	public Stop(){
		super.Stop();
		this._AttachedEntity.Position.y = 1.15;
		this._HopClock.stop();
	}

	public MoveTo(moveTo: Vector3) {
		super.MoveTo(moveTo);		
		this._HopClock.start();
	}
}

enum MoveState {
	IDLE, // I have no Instructions.
	HOPPING, // Hopping
}