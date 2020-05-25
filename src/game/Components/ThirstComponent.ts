import { Component } from "./_Component";
import { Group, Clock } from 'THREE';
import { WebComponentDecorator, WebComponent } from "../_System/_WebComponent";
import { NameplateComponent } from ".";
import { HungerComponent, HungerWebComponent } from "./HungerComponent";


export class ThirstComponent extends Component {
	protected _Key: string = 'ThirstComponent';

	private _ThirstWebComponent: ThirstWebComponent;

	private _Clock: Clock;

	public readonly MaxThirst: number;
	private _CurrentThirst: number
	/**
	 * Gets or sets 
	 */
	public get CurrentThirst(): number { return this._CurrentThirst; }

	public get ThirstPercentage(): number {
		return (this._CurrentThirst / this.MaxThirst) * 100.0;
	}
 
	/**
	 * 
	 * @param maxThirst 
	 * @param startingThirst 
	 */
	constructor(maxThirst: number, startingThirst: number = maxThirst) {
		super(); 

		this._Clock = new Clock(false);
		this.MaxThirst = maxThirst;
		this._CurrentThirst = startingThirst;
	}

	public Render(group: Group): void {  

		this._ThirstWebComponent = <HungerWebComponent>document.createElement('eco-thirst');
		this._ThirstWebComponent.CurrentPercentage = this.ThirstPercentage;

		this._AttachedEntity
			.GetComponent<NameplateComponent>("NameplateComponent")
			.AddWebComponent(this._ThirstWebComponent);	

		this._Clock.start();
	}

	public Update(): void {  
		if(this._Clock.getElapsedTime() >= 30){
			this.RemoveThirst(1);
			this._Clock.start();
		}
	}  

	public ReplenishThirst(amount: number): void {
		this._CurrentThirst = Math.min(this.CurrentThirst + amount, this.MaxThirst);
		this._ThirstWebComponent.CurrentPercentage = this.ThirstPercentage;
		
		this._Clock.start();
	}

	public RemoveThirst(amount: number): void {
		this._CurrentThirst = Math.max(0, this.CurrentThirst - amount);
		this._ThirstWebComponent.CurrentPercentage = this.ThirstPercentage;
	}
}

@WebComponentDecorator({ 
	componentName: 'eco-thirst',
	template: `
<div class="Lifebar Thirst">       
	<div class="LifebarFragment"></div>
	<div class="LifebarFragment"></div>
	<div class="LifebarFragment"></div>
	<div class="LifebarFragment"></div>
	<div class="LifebarFragment"></div>  
</div>`
})
class ThirstWebComponent extends HungerWebComponent  {

}
