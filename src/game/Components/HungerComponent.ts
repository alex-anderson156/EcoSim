import { Component } from "./_Component";
import { Group } from 'THREE';

export class HungerComponent extends Component {
	protected _Key: string = 'HungerComponent';

	public readonly MaxHunger: number;
	
	private _CurrentHunger: number
	/**
	 * Gets or sets 
	 */
	public get CurrentHunger(): number { return this._CurrentHunger; }

	public get HungerPercentage(): number {
		return (this._CurrentHunger / this.MaxHunger) * 100.0;
	}
 
	constructor(maxHunger: number, startingHunger: number = maxHunger / 2) {
		super(); 
		
		this.MaxHunger = maxHunger;
		this._CurrentHunger = this.CurrentHunger;
	}

	public Render(group: Group): void { 
		 // Nothing to render as of yet ...			
	}

	public Update(): void {  
		//TODO: Decay Current hunger at a set value.
	}  

	public ReplenishHunger(amount: number): void {
		this._CurrentHunger = Math.min(this.CurrentHunger + amount, this.MaxHunger);
	}

	public RemoveHunger(amount: number): void {
		this._CurrentHunger = Math.max(0, this.CurrentHunger - amount);
	}
}