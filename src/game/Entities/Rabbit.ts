import { Vector3 } from 'THREE';
import { World } from "../World";
import * as Entities from ".";
import * as Components from "../Components";

/**
 * Instance data bout a specific tree
 */
export class Rabbit extends Entities.Entity {
	constructor(position: Vector3) {
		super(position); 		
	}
}