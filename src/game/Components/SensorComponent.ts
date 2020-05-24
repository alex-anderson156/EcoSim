import { Component } from "./_Component";

import { Group, CircleGeometry, Mesh, MeshBasicMaterial, Color, Scene} from 'THREE';
import { Entity } from "../Entities";


export class SensorComponent extends Component {
	protected _Key: string = 'SensorComponent';


	public _SensorGroup: Group;
 
	constructor() {
		super(); 

		this._SensorGroup = new Group();
	}

	public Render(group: Group): void { 
		
		const sensorCircle: CircleGeometry = new CircleGeometry(6, 16);  
		const sensorCircleMat: MeshBasicMaterial = new MeshBasicMaterial({ color: new Color(0xadd8e6)})
		sensorCircleMat.polygonOffset = true;
		sensorCircleMat.depthWrite = false;
		sensorCircleMat.depthTest = true;
		sensorCircleMat.transparent = true;
		sensorCircleMat.opacity = 0.2;


		let sensorMesh: Mesh = new Mesh(sensorCircle, sensorCircleMat);
		sensorMesh.visible = false;
		sensorMesh.rotateX(-Math.PI / 2);
		sensorMesh.position.y += 0.25;
		  
		this._SensorGroup.add(sensorMesh); 

		group.add(this._SensorGroup);				
	}

	public Update(): void {
  
	}


	public EnableRendering(enabled: boolean = true): void {
		this._SensorGroup.traverse(obj => obj.visible = enabled);
	}  
	
}