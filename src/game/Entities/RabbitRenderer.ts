import { Scene, BoxGeometry, MeshLambertMaterial, Mesh, Color, Group } from 'THREE';
import { Rabbit } from './Rabbit';
import { EntityRenderer } from './Entity';

export class RabbitRenderer extends EntityRenderer<Rabbit> {
	private _Mesh: Mesh;
	constructor() {
		super();
	}
	public Load(): Promise<this> {
		let geom = new BoxGeometry(0.3, 0.3, 0.3);
		let material: MeshLambertMaterial = new MeshLambertMaterial({ color: new Color(0xa15016) });
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
