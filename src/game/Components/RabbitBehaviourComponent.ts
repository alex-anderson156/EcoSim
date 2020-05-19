import { Component } from "./_Component";
import { Group } from 'THREE';
import { World } from "../World";
import { EntityCollection, Plant } from "../Entity";

export class RabbitBehaviourComponent extends Component {
	protected _Key: string = 'RabbitBehaviourComponent';
 
	constructor(world: World, plants: EntityCollection<Plant>) {
		super();  
	}

	public Render(group: Group): void { 
		 // Nothing to render as of yet ...			
	}

	public Update(): void {
  
	}  
	
}