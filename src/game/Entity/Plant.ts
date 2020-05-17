import { Entity, EntityRenderer } from "./Entity"; 
import { Scene, Vector3 } from 'THREE';

/**
 * Instance data bout a specific tree
 */
export class Plant extends Entity {


	constructor(position: Vector3) {
		super(position); 
	}


	public Update(): void {

	} 
}

export class PlantRenderer extends EntityRenderer<Plant>{
	
	constructor(){
		super('assets/plant_01.glb');
	}


	public Render(scene: Scene, entityRef: Plant) {

		super.Render(scene, entityRef, 0);

	}
}