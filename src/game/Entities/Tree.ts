import { Entity, EntityRenderer } from "./Entity"; 
import { Scene, Vector3 } from 'THREE';

/**
 * Instance data bout a specific tree
 */
export class Tree extends Entity {


	constructor(position: Vector3) {
		super(position); 
	}

	public Update(): void {

	} 
}

export class TreeRenderer extends EntityRenderer<Tree>{
	
	constructor(){
		super('assets/tree_02.glb');
	}


	public Render(scene: Scene, entityRef: Tree) {

		super.Render(scene, entityRef, 0);

	}
}