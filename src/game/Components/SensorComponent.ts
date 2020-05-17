import { Component } from "./_Component";

import { Group, Vector3, CircleGeometry, Mesh, MeshBasicMaterial, Color} from 'THREE';


export class SensorComponent extends Component {
	protected _Key: string = 'SensorComponent';
 
	constructor() {
		super(); 
	}

	public Render(group: Group): void { 
		
		const sensorCircle: CircleGeometry = new CircleGeometry(3, 16); 
		const sensorCircleMat: MeshBasicMaterial = new MeshBasicMaterial({ color: new Color(0xadd8e6)});
		sensorCircleMat.transparent = true;
		sensorCircleMat.opacity = 0.4;


		let sensorMesh: Mesh = new Mesh(sensorCircle, sensorCircleMat);
		sensorMesh.rotateX(-Math.PI / 2);
		sensorMesh.position.y += 0.25;
		group.add(sensorMesh);


		const sensorCircle2: CircleGeometry = new CircleGeometry(8, 16); 
		const sensorCircleMat2: MeshBasicMaterial = new MeshBasicMaterial({ color: new Color(0xadd8e6)});
		sensorCircleMat2.transparent = true;
		sensorCircleMat2.opacity = 0.2;


		let sensorMesh2: Mesh = new Mesh(sensorCircle2, sensorCircleMat2);
		sensorMesh2.rotateX(-Math.PI / 2);
		sensorMesh2.position.y += 0.24;
		group.add(sensorMesh2);
	}

	public Update(): void {
  
	}
	
}