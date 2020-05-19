import { Component } from "./_Component";
import { Group } from 'THREE';

export class PlantComponent extends Component {
	protected _Key: string = 'PlantComponent';

	private _FoodAmount: number;
 
 
	constructor(foodAmount: number) {
		super(); 
		this._FoodAmount = foodAmount;
	}

	public Render(group: Group): void { 
		 // Nothing to render as of yet ...			
	}

	public Update(): void {
  
	}  
	
}