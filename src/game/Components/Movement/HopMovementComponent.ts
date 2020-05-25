import { Vector3, Clock } from 'THREE';
import { PathfinderMovementComponent } from './PathfinderMovementComponent';
import { MoveState } from './MovementComponent';
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
		this._AttachedEntity.Position.y = 1.15 + y;
	}

	protected MoveToNextNode() {
		super.MoveToNextNode();

		if (this._MoveState == MoveState.IDLE)
			return;

		this._AttachedEntity.Position.y = 1.15;
	}

	public Stop() {
		super.Stop();
		this._AttachedEntity.Position.y = 1.15;
		this._HopClock.stop();
	}

	public MoveTo(moveTo: Vector3) {
		super.MoveTo(moveTo);
		this._HopClock.start();
	}
}
