import { Component } from "./_Component";
import { Group, Clock } from 'THREE';
import { WebComponentDecorator, WebComponent } from "../_System/_WebComponent";
import { NameplateComponent } from ".";


export class HungerComponent extends Component {
	protected _Key: string = 'HungerComponent';

	private _HungerWebComponent: HungerWebComponent;


	private _Clock: Clock;

	public readonly MaxHunger: number;
	private _CurrentHunger: number
	/**
	 * Gets or sets 
	 */
	public get CurrentHunger(): number { return this._CurrentHunger; }

	public get HungerPercentage(): number {
		return (this._CurrentHunger / this.MaxHunger) * 100.0;
	}
 
	/**
	 * 
	 * @param maxHunger 
	 * @param startingHunger 
	 */
	constructor(maxHunger: number, startingHunger: number = maxHunger / 2) {
		super(); 
		
		this._Clock = new Clock(false);
		this.MaxHunger = maxHunger;
		this._CurrentHunger = startingHunger;
	}

	public Render(group: Group): void {  

		this._HungerWebComponent = <HungerWebComponent>document.createElement('eco-hunger');
		this._HungerWebComponent.CurrentPercentage = this.HungerPercentage;

		this._AttachedEntity
			.GetComponent<NameplateComponent>("NameplateComponent")
			.AddWebComponent(this._HungerWebComponent);	

		this._Clock.start();
	}

	public Update(): void {  
		if(this._Clock.getElapsedTime() >= 60){
			this.RemoveHunger(1);
			this._Clock.start();
		}
	}  

	public SetHunger(value: number ) {
		this._CurrentHunger = Math.min(Math.max(value, 0), this.MaxHunger);
		this._HungerWebComponent.CurrentPercentage = this.HungerPercentage; 
		this._Clock.start();
	}

	public ReplenishHunger(amount: number): void {
		this._CurrentHunger = Math.min(this.CurrentHunger + amount, this.MaxHunger);
		this._HungerWebComponent.CurrentPercentage = this.HungerPercentage;

		this._Clock.start();
	}

	public RemoveHunger(amount: number): void {
		this._CurrentHunger = Math.max(0, this.CurrentHunger - amount);
		this._HungerWebComponent.CurrentPercentage = this.HungerPercentage;
	}
}

@WebComponentDecorator({ 
	componentName: 'eco-hunger',
	template: `
<div class="Lifebar Hunger">       
	<div class="LifebarFragment"></div>
	<div class="LifebarFragment"></div>
	<div class="LifebarFragment"></div>
	<div class="LifebarFragment"></div>
	<div class="LifebarFragment"></div>  
</div>`
})
export class HungerWebComponent extends WebComponent  {

	private _CurrentPercentage: number
	/**
	 * Gets or sets the current percentage
	 */
	public get CurrentPercentage(): number { return this._CurrentPercentage; }
	public set CurrentPercentage(value: number) { 
		this._CurrentPercentage = value;

		if(this.HasRendered)
			this.UpdateDOM();
	}

	private _Fragments: HTMLElement[] = [];

	public RenderWebComponent() {
		super.RenderWebComponent();

		this.querySelectorAll('.Lifebar .LifebarFragment').forEach(($element: Element) => { 
			this._Fragments.push(<HTMLElement>$element);
		});

		this.UpdateDOM();
	}

	private UpdateDOM() {
		let fragmentIndex: number = 0;
		for(let cp: number = 20; cp <= 100; cp += 20, fragmentIndex++) {
			if(this._CurrentPercentage < cp) {
				this._Fragments[fragmentIndex].className = 'LifebarFragment';
			}
			else
				this._Fragments[fragmentIndex].className = 'LifebarFragment Full';
		}

		if(this._CurrentPercentage >= 100)
			this.className = 'HideMe'; 
		else
			this.className = '';
	}

}
