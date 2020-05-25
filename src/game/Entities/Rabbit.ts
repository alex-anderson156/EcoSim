import { Vector3 } from 'THREE';
import { World } from "../World";

import * as Entities from ".";
import * as Components from "../Components";

/**
 * Instance data bout a specific tree
 */
export class Rabbit extends Entities.Entity {
	constructor(position: Vector3, world: World) {
		super(position); 	
		
		this.AddComponents(
			new Components.HopMovementComponent(.75, world),
			new Components.NameplateComponent(),
			new Components.HungerComponent(10, 5),
			new Components.ThirstComponent(10)
		);
	}
}