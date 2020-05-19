import { Scene, Vector3, Euler, Group, Mesh } from 'THREE';
import * as _ from 'lodash';
import { GLTFLoader , GLTF} from 'THREE/examples/jsm/loaders/GLTFLoader';
import { IComponent } from '../Components/_Component';
import { Dictionary } from '../_System/Dictionary';

export class Entity {

	protected _Position: Vector3;
	/**
	 * Gets or sets 
	 * N.B: this is directly linked to the mesh. DO NOT DISTURB the reference!
	 */
	public get Position(): Vector3 { return this._Position; }
	public set Position(value: Vector3) { this._Position = value; }

	protected _CurrentRotation: Vector3
	/**
	 * Gets the rotation of the object in 3D space.
	 * To set this. please use Rotate*() functions.
	 */
	public get Rotation(): Vector3 { return this._CurrentRotation; } 

	protected _RotationEuler: Euler
	/**
	 * Gets or sets Euler rotation of the entity in 3D space. 
	 * N.B: this is directly linked to the mesh. DO NOT DISTURB the reference!
	 */
	public get RotationEuler(): Euler { return this._RotationEuler; }
	public set RotationEuler(value: Euler) { this._RotationEuler = value; }

	protected _Scale: Vector3
	/**
	 * Gets or sets the scale of the object in 3D space.
	 * N.B: this is directly linked to the mesh. DO NOT DISTURB the reference!
	 */
	public get Scale(): Vector3 { return this._Scale; }
	public set Scale(value: Vector3) { this._Scale = value; }

	private _Components: Dictionary<IComponent>;

	/**
	 * Initialises a new instance of the Entity class.
	 */
	constructor(initialPosition: Vector3) {
		this._Position = initialPosition
		this._Scale = new Vector3(1, 1, 1);			
		this.Rotate(0, 0, 0);
		this._Components = new Dictionary<IComponent>();
	}

	/**
	 * Performs logic to update the Entities data.	 
	 */
	Update(): void {


		for(let component of this._Components.Values)
			component.Update();
	}
 
	//#region Entity Transforms

	public Move(x: Vector3 | number, y?: number, z?: number) {
		if(x instanceof Vector3) {
			this._Position.x += x.x;
			this._Position.y += x.y;
			this._Position.z += x.z;
		}
		else {
			this._Position.x += x;
			this._Position.y += y;
			this._Position.z += z;
		}
	}

	/**
	 * Sets the rotatation of the Entity in 3D space.
	 * @param x - the rotation to set on the X-Axis.
	 * @param y - the rotation to set on the y-Axis.
	 * @param z - the rotation to set on the Z-Axis.
	 */
	public Rotate(x: number, y: number, z: number) {
		if(!this._CurrentRotation)
			this._CurrentRotation = new Vector3(0, 0, 0);

		if(!this._RotationEuler)
			this._RotationEuler = new Euler(0, 0 , 0);

		this._CurrentRotation.x = x;
		this._CurrentRotation.y = y;
		this._CurrentRotation.z = z; 

		this._RotationEuler.setFromVector3(this._CurrentRotation);
	}
	/**
	 * Sets the Rotation of the object on the X Axis.	
	 * @param angle - the angle in degrees to set rotation to.
	 */
	public RotateX(angle: number){
		this.Rotate(angle, this._CurrentRotation.y, this._CurrentRotation.z)
	}
	/**
	 * Sets the Rotation of the object on the Y Axis.	
	 * @param angle - the angle in degrees to set rotation to.
	 */
	public RotateY(angle: number){
		this.Rotate(this._CurrentRotation.x,  angle, this._CurrentRotation.z)
	}
	/**
	 * Sets the Rotation of the object on the Z Axis.	
	 * @param angle - the angle in degrees to set rotation to.
	 */
	public RotateZ(angle: number){
		this.Rotate(this._CurrentRotation.x, this._CurrentRotation.y, angle);
	}

	//#endregion

	//#region Entity-Component System

	public GetComponent<C extends IComponent>(key: string): C {
		return <C>this._Components.GetValueOrNull(key);
	}
 
	public AddComponents(...components: IComponent[]) {
 
		for(let component of components) {
			if(this._Components.ContainsKey(component.Key))
				throw 'the Specified component is not unique to the Entity.';

			this._Components.Add(component.Key, component);
			component.AttachToEntity(this);
		}
	}

	public AddComponentsToEntityGroup(entityGroup: Group): void {
		if(!this._Components)
			return;

		for(let component of this._Components.Values)
			component.Render(entityGroup);
	}

	//#endregion
}
 



export class EntityRenderer<T extends Entity> {

	private _AssetFiles: string[];
	
	protected _Resources: Group[];

	constructor(...assetFiles: string[]) {
		this._AssetFiles = assetFiles;
	}

	public Load(): Promise<this> {
		if(!_.some(this._AssetFiles))
			throw 'Asset Files not suppled. Please override the Load method to create your object.';
 
		let loader: GLTFLoader = new GLTFLoader();
		this._Resources = new Array<Group>();

		let promises: Array<Promise<void>> = new Array<Promise<void>>();

		for(let resource of this._AssetFiles){
			let promise = new Promise<void>((resolve) => {
				loader.load(resource, (gltf: GLTF) => {
					gltf.scene.traverse(o => {
						if(o instanceof Mesh)
							o.castShadow = true;
					});
					this._Resources.push(gltf.scene); 

					resolve();
				});  
			});
			promises.push(promise);
		} 
 
		return Promise.all(promises).then(() => this);
	}

	public Render(scene: Scene, entityRef: T, resourceIndex: number = 0) {
		
		// base assumes only 1 mesh supplied.
		let entityGroup: Group = this._Resources[resourceIndex].clone();
		entityGroup.castShadow = true;
		
		// Copy the entity position to the new mesh.
		entityGroup.position.copy(entityRef.Position);
		entityRef.Position = entityGroup.position;

		// Copy the entity rotation to the new mesh.
		entityGroup.rotation.copy(entityRef.RotationEuler);
		entityRef.RotationEuler = entityGroup.rotation;

		entityGroup.scale.copy(entityRef.Scale);
		entityRef.Scale = entityGroup.scale;

		entityRef.AddComponentsToEntityGroup(entityGroup);
		scene.add(entityGroup); 
		
	}
} 