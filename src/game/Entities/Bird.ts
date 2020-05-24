import { Entity, EntityRenderer } from "./Entity"; 
import { Scene, BoxGeometry, MeshLambertMaterial, Mesh, Color, Group, Vector3 } from 'THREE';

/**
 * Instance data bout a specific tree
 */
export class Bird extends Entity {


	constructor(position: Vector3) {
		super(position); 

	} 
}

export class BirdRenderer extends EntityRenderer<Bird>{
	private _Mesh: Mesh;

	constructor(){
		super();
	}

	public Load(): Promise<this> {
		let geom = new BoxGeometry(0.6, 0.3, 0.4);
		let material: MeshLambertMaterial = new MeshLambertMaterial({ color: new Color(0x3d3d3d) });
		let mesh: Mesh = new Mesh(geom, material);
		mesh.castShadow = true;
		let group = new Group();
		group.add(mesh);
		this._Resources = new Array<Group>();
		this._Resources.push(group);
		return Promise.resolve(this);
	}

	public Render(scene: Scene, entityRef: Bird) {

		super.Render(scene, entityRef, 0);

	}
}