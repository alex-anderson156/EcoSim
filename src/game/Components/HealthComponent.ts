import * as _ from 'lodash';
import { Group, Clock} from 'THREE';

import { Component } from "./_Component";
import { Entity } from "../Entities";


export class HealthComponent extends Component {
	protected _Key: string = 'HealthComponent';
 
	private _MaxHealth: number;
	private _HealthPool: number;
	private _RegenRateInSeconds: number;
	private _RegenClock: Clock;

	constructor(maxHealth: number, regenRateInSecs: number) {
		super(); 

		this._RegenRateInSeconds = regenRateInSecs;
		this._HealthPool = maxHealth;
		this._MaxHealth = maxHealth;
		this._RegenClock = regenRateInSecs == 0 ? null :new Clock(true); 
	}

	public Render(group: Group): void { 
		 			
	}

	public Update(): void {
		if(this._RegenClock && this._RegenClock.getElapsedTime() >= this._RegenRateInSeconds) {
			this._HealthPool = Math.max(this._MaxHealth, this._HealthPool+1);
		}
	}
 
	/**
	 * Take damage equal to the amount supplied.	
	 * @param amount The amount of damage to take to the health pool.
	 * @returns the overflow of the amount inflicted.
	 */
	public TakeDamage(amount: number): number {
		this._HealthPool -= amount;

		if(this._HealthPool <= 0) {
			this._HealthPool = 0;			
			this.Die();
			return Math.abs(this._HealthPool - amount);
		}

		this.Hit();
		return 0;
	}

	private _Listeners: Array<IHealthListner>; 

	public Subscribe(healthListener: IHealthListner): HealthComponent {
		this._Listeners.push(healthListener);
		return this;
	}

	public Unsubscribe(healthListener: IHealthListner): HealthComponent {
		let index: number = _.indexOf(this._Listeners, healthListener);
		if(index > 0)
			this._Listeners.splice(index, 1);

		return this;
	}
   
	private Die(): void {
		for(let listener of this._Listeners)
			listener.OnDeath();
	}

	private Hit(): void {
		for(let listener of this._Listeners)
			listener.OnHit();
	}
}

export interface IHealthListner {
	OnHit(): void;
	OnDeath(): void;
}