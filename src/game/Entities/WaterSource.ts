import { Entity, EntityRenderer } from "./Entity"; 
import { Scene, Vector3, BoxGeometry, MeshLambertMaterial, Mesh, Color, Group } from 'THREE'; 

import * as Components from '../Components';  

/**
 * 
 */
export class WaterSource extends Entity {
 
	constructor(position: Vector3) {
		super(position); 
  
		this.AddComponents( 
			
		);	
	}
}

export class WaterSourceRenderer extends EntityRenderer<WaterSource>{
	
	constructor() {
		super();
	}

	public Load(): Promise<this> { 
		let geom = new BoxGeometry(0.1, 0.1, 0.1); 
		let material: MeshLambertMaterial = new MeshLambertMaterial({ color: new Color(0x45a4ca) }); 
		let mesh: Mesh = new Mesh(geom, material);  
		let group = new Group(); 
		group.add(mesh); 
		this._Resources = new Array<Group>(); 
		this._Resources.push(group); 
		return Promise.resolve(this); 
	} 


	public Render(scene: Scene, entityRef: WaterSource) {
		super.Render(scene, entityRef, 0);
	}
}