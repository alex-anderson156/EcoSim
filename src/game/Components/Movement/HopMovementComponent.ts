import { Vector3, Clock } from 'THREE';
import { PathfinderMovementComponent } from './PathfinderMovementComponent';
import { MoveState, MoveToResult } from './MovementComponent';
import { World } from '../../World';


export class HopMovementComponent extends PathfinderMovementComponent {
	protected _HopClock: Clock;
	
	constructor(moveSpeed: number, world: World) {
		super(moveSpeed, world);
		this._HopClock = new Clock();
		this._HopClock.start();
	}

	public Update() {
		super.Update();

		if (this._MoveState == MoveState.IDLE)
			return;

		let y: number = (Math.sin(10 * this._HopClock.getElapsedTime()) + 1) / 6;
		this._AttachedEntity.Position.y = 1 + y;
	}

	protected MoveToNextNode(): boolean {
		let result: boolean = super.MoveToNextNode();
		if (!result)
			this._AttachedEntity.Position.y = 1;

		return result;
	}

	public Stop() {
		super.Stop();
		
		if (this._MoveState == MoveState.IDLE) {
			this._AttachedEntity.Position.y = 1;
			this._HopClock.stop();
		}
	}

	public MoveTo(moveTo: Vector3): MoveToResult {
		let result = super.MoveTo(moveTo);

		if(result == MoveToResult.PathFound)
			this._HopClock.start();

		return result;
	}
}
