import { WebGLRenderer, PerspectiveCamera, AxesHelper, AmbientLight, Color, Raycaster, Vector2, PointLight, PointLightHelper, Vector3 } from 'THREE';
import { MapControls } from 'THREE/examples/jsm/controls/OrbitControls';
import { EcoScene } from "../_Base/EcoScene"; 
import { World } from "../World"; 
import { Dictionary } from '../_System/Dictionary';
import { Region } from '../World/Region';
import { PerlinNoiseMapGenerator, StaticMapGenerator } from '../World/MapGenerator';
import { MapRenderer } from '../World/MapRenderer'; 
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';

import * as Entities from '../Entity'; 
import * as Components from '../Components';  


export class DevViewerScene extends EcoScene {

	private _MousePosition2D: Vector2;
	private _Raycaster: Raycaster;


	//#region Game Session Vars
	private _World: World;

	//#endregion


	constructor() {
		super();
	}

	//#region Public Methods

	public LoadContent(): Promise<void> {		 
		return Promise.resolve();
	}

	public BuildScene(wegGLRenderer: WebGLRenderer, css2drenderer: CSS2DRenderer, css3drenderer: CSS3DRenderer): void {	
		this._Camera = new PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000); 
		this._Camera.position.z = 10 ;
		this._Camera.position.y = 10 ;
		 
		let controls = new MapControls(this._Camera, css3drenderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;
		controls.enableZoom = true;

		let axisHelper = new AxesHelper(3);
		this._SceneObj.add(axisHelper);

		let ambientLight: AmbientLight = new AmbientLight(0x404040, 1);  
		this._SceneObj.add(ambientLight);

		let pointLight: PointLight = new PointLight(0x404040, 3, 500, 2);
		pointLight.position.set(32, 100, 32);
		pointLight.castShadow = true;
		let pointLightHelper: PointLightHelper = new PointLightHelper(pointLight); 

		this._SceneObj.add(pointLight)
		this._SceneObj.add(pointLightHelper); 
		 
		let regionDict = new Dictionary<Region>(); 
		regionDict.Add('DeepWater', 	new Region('Water', 0.1, new Color(0x2b7897), false));
		regionDict.Add('Water', 		new Region('Water', 0.2, new Color(0x45a4ca), false));
		regionDict.Add('ShallowWater', 	new Region('Water', 0.3, new Color(0x81c1db), false));
 
		regionDict.Add('Sand', 	new Region('Sand', 0.4, new Color(0xceee8aa), true)); 	
		 
		regionDict.Add('Grass',  new Region('Grass', 0.6, new Color(0x2cb42c), true));
		regionDict.Add('Grass1', new Region('Grass', 0.7, new Color(0x279f27), true));
		regionDict.Add('Grass2', new Region('Grass', 0.8, new Color(0x228b22), true));
		regionDict.Add('Grass3', new Region('Grass', 0.9, new Color(0x1d771d), true, true));
		regionDict.Add('Grass4', new Region('Grass', 1.1, new Color(0x186218), true, true));
  
		this._World = new World(
			64, 64, 64,
			new PerlinNoiseMapGenerator(),
			new MapRenderer(regionDict)
		);
		this._World.Build(this);		
  
		// Seed Trees and Plants into the World
		this.SeedTrees(Math.floor(Math.random() * 100));
		this.SeedPlants(Math.floor(Math.random() * 200));

		this.SeedRabbits(Math.floor(Math.random() * 100));
		
		// Raycaster
		this._Raycaster = new Raycaster(); 
		window.addEventListener('mousemove', this.onMouseMove, false );
	}

	private _Rabbits: Entities.Rabbit[];
 
	public Update(): void {
		if(this._MousePosition2D){
			this._Raycaster.setFromCamera(this._MousePosition2D, this._Camera); 
		} 

		if(this._Rabbits) {
			for(let rabbit of this._Rabbits)
				rabbit.Update();
		}
		
	}

	//#endregion


	//#region Private Methods

	private SeedTrees(count: number) {
		let treeRenderer: Entities.TreeRenderer = new Entities.TreeRenderer();
		treeRenderer.Load()
		.then(() => {
			for(let i = 0 ; i < count; i++) {
				let randX: number = Math.floor(Math.random() * this._World.WorldWidth)
				let randZ: number = Math.floor(Math.random() * this._World.WorldDepth)

				if(!this._World.IsPassable(randX, randZ)) {
					continue;
				}

				treeRenderer.Render(this._SceneObj, new Entities.Tree(new Vector3(randX, 1, randZ)));
			}
		});
	}

	private SeedPlants(count: number) {
		let plantRenderer: Entities.PlantRenderer = new Entities.PlantRenderer();
		plantRenderer.Load()
		.then(() => {
			for(let i = 0 ; i < count; i++) {
				let randX: number = Math.floor(Math.random() * this._World.WorldWidth)
				let randZ: number = Math.floor(Math.random() * this._World.WorldDepth)

				if(!this._World.IsPassable(randX, randZ)) {	
					continue;
				}

				plantRenderer.Render(this._SceneObj, new Entities.Plant(new Vector3(randX, 1, randZ)));
			}
		});
	}

	private SeedRabbits(count: number) {
		this._Rabbits = new Array<Entities.Rabbit>();
		let rabbitLoader: Entities.RabbitRenderer = new Entities.RabbitRenderer();
		rabbitLoader.Load()
			.then(() => {

				for(let i = 0 ; i < count;) {
					let randX: number = Math.floor(Math.random() * this._World.WorldWidth)
					let randZ: number = Math.floor(Math.random() * this._World.WorldDepth)

					if(!this._World.IsPassable(randX, randZ)) {	
						continue;
					}
					
					let rabbit: Entities.Rabbit = new Entities.Rabbit(new Vector3(randX, 1.15, randZ));					
					rabbit.AddComponents(
						new Components.HopMovementComponent(1),
						new Components.RandomMoveComponent(this._World)
					);

					rabbitLoader.Render(this._SceneObj, rabbit);
					this._Rabbits.push(rabbit);
					i++;
				}
			});
	}

	//#endregion

	//#region Events

	private onMouseMove = (event: any) => {
		if(!this._MousePosition2D)
			this._MousePosition2D = new Vector2();
	
		// calculate mouse position in normalized device coordinates
		// (-1 to +1) for both components	
		this._MousePosition2D.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		this._MousePosition2D.y = - ( event.clientY / window.innerHeight ) * 2 + 1; 
	} 

	//#endregion
}