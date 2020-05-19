import { Component } from "./_Component";
import { Group } from 'THREE';

export class HungerComponent extends Component {
	protected _Key: string = 'HungerComponent';
 
	constructor(foodAmount: number) {
		super();  
	}

	public Render(group: Group): void { 
		 // Nothing to render as of yet ...			
	}

	public Update(): void {
  
	}  
	
}