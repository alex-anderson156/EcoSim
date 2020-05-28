import { Vector3 } from 'THREE';
import { World } from "../World";
import { Scene, BoxGeometry, MeshLambertMaterial, Mesh, Color, Group } from 'THREE';

import * as Entities from ".";
import * as Components from "../Components";

/**
 * Instance data bout a specific tree
 */
export class Rabbit extends Entities.Entity {
	constructor(position: Vector3, world: World) {
		super(position); 	
		
		this.AddComponents(
			new Components.HopMovementComponent(.4, world),
			new Components.NameplateComponent(),
			new Components.HungerComponent(10, 5),
			new Components.ThirstComponent(10, 3)
		);
	}
}
 

export class RabbitRenderer extends Entities.EntityRenderer<Rabbit> {
	private _Mesh: Mesh;

	constructor() {
		super('assets/rabbit_01.glb');
	}

	public Render(scene: Scene, entityRef: Rabbit) {
		super.Render(scene, entityRef, 0);
	}
}
