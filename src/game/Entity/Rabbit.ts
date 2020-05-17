import { Entity, EntityRenderer } from "./Entity"; 
import { Scene, Vector3, BoxGeometry, MeshLambertMaterial, Mesh, Color, Group } from 'THREE';

/**
 * Instance data bout a specific tree
 */
export class Rabbit extends Entity {


	constructor(position: Vector3) {
		super(position); 
	}
}

export class RabbitRenderer extends EntityRenderer<Rabbit>{

	private _Mesh: Mesh;
	
	constructor(){
		super();
	}


	public Load(): Promise<this>{

		let geom = new BoxGeometry(0.3, 0.3, 0.3);
		let material: MeshLambertMaterial = new MeshLambertMaterial({ color: new Color(0xa15016)});

		let mesh: Mesh = new Mesh(geom, material);
		mesh.castShadow = true;
		
		let group = new Group();
		group.add(mesh);

		this._Resources = new Array<Group>();
		this._Resources.push(group);

		return Promise.resolve(this);
	}

	public Render(scene: Scene, entityRef: Rabbit) {
		super.Render(scene, entityRef, 0);
	}
}