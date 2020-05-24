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

import * as _ from 'lodash';

import * as Entities from '../Entities'; 
import * as Components from '../Components';   


export class SimulationScene extends EcoScene {

	//#region Properties

	private _World: World;

	private _Trees: Entities.EntityCollection<Entities.Tree>;
	private _Plants: Entities.EntityCollection<Entities.Plant>;
	private _Rabbits: Entities.EntityCollection<Entities.Rabbit>;

	//#endregion

	/**
	 * Initialises a new instance of the SimulationScene
	 */
	constructor() {
		super();
	}



	public LoadContent(): Promise<void> { 
		return Promise.resolve();
	}

	public BuildScene(wegGLRenderer: WebGLRenderer, css2drenderer: CSS2DRenderer, css3drenderer: CSS3DRenderer): void {	
		this._Camera = new PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000); 
		this._Camera.position.z = 10 ;
		this._Camera.position.y = 10 ;

		let ambientLight: AmbientLight = new AmbientLight(0x404040, 1);  
		this._SceneObj.add(ambientLight);

		let pointLight: PointLight = new PointLight(0x404040, 3, 500, 2);
		pointLight.position.set(32, 100, 32);
		pointLight.castShadow = true;
		let pointLightHelper: PointLightHelper = new PointLightHelper(pointLight); 

		this._SceneObj.add(pointLight)
		this._SceneObj.add(pointLightHelper); 
		 
		let controls = new MapControls(this._Camera, css3drenderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;
		controls.enableZoom = true;

		let regionDict = new Dictionary<Region>(); 
		regionDict.Add('DeepWater', 	new Region('Water', 0.1, new Color(0x2b7897), false));
		regionDict.Add('Water', 		new Region('Water', 0.2, new Color(0x45a4ca), false));
		regionDict.Add('ShallowWater', 	new Region('Water', 0.3, new Color(0x81c1db), false));
 
		regionDict.Add('Sand', 		new Region('Sand', 0.33, new Color(0xf9e1a8), true)); 	
		regionDict.Add('Sand2', 	new Region('Sand', 0.36, new Color(0xf7d990), true)); 	
		regionDict.Add('Sand3', 	new Region('Sand', 0.40, new Color(0xf5d178), true)); 	
		 
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

		this.SeedTrees(50);
		this.SeedPlants(50);
		this.SeedRabbits(10);
	}
  
	public Update(): void {

		if(this._Plants){
			_.forEach(this._Plants.Entities, plant => plant.Update());
		}

		if(this._Rabbits){
			_.forEach(this._Rabbits.Entities, rabbit => rabbit.Update());
		}

	}	

	//#region Private Methods

	private SeedTrees(count: number) {
		let treeRenderer: Entities.TreeRenderer = new Entities.TreeRenderer();
		treeRenderer.Load()
		.then(() => {
			for(let i = 0 ; i < count;) {
				let randX: number = Math.floor(Math.random() * this._World.WorldWidth)
				let randZ: number = Math.floor(Math.random() * this._World.WorldDepth)

				if(!this._World.IsPassable(randX, randZ)) {
					continue;
				}

				treeRenderer.Render(this._SceneObj, new Entities.Tree(new Vector3(randX, 1, randZ)));
				i++
			}
		});
	}

	private SeedPlants(count: number) {
		this._Plants = new Entities.EntityCollection<Entities.Plant>();
		
		let plantRenderer: Entities.PlantRenderer = new Entities.PlantRenderer();
		plantRenderer.Load()
		.then(() => {
			for(let i = 0 ; i < count; ) {
				let randX: number = Math.floor(Math.random() * this._World.WorldWidth)
				let randZ: number = Math.floor(Math.random() * this._World.WorldDepth)

				if(!this._World.IsPassable(randX, randZ)) {	
					continue;
				}

				let plant: Entities.Plant = new Entities.Plant(new Vector3(randX, 1, randZ));

				plant.AddComponents(
					new Components.HealthComponent(5, 10).Subscribe(plant),
				)
				
				plantRenderer.Render(this._SceneObj, plant);
				this._Plants.Add(plant);
				i++
			}
		});
	}

	private SeedRabbits(count: number) {
		this._Rabbits = new Entities.EntityCollection<Entities.Rabbit>();
		let rabbitLoader: Entities.RabbitRenderer = new Entities.RabbitRenderer();
		rabbitLoader.Load()
			.then(() => {

				for(let i = 0 ; i < count;) {
					let randX: number = Math.floor(Math.random() * this._World.WorldWidth)
					let randZ: number = Math.floor(Math.random() * this._World.WorldDepth)

					if(!this._World.IsPassable(randX, randZ)) {	
						continue;
					}
					
					let rabbit: Entities.Entity = new Entities.Entity(
						new Vector3(randX, 1.15, randZ),
					);					

					rabbit.AddComponents(
						//new Components.NameplateComponent(),
						new Components.HungerComponent(10),
						//new Components.RabbitBehaviourComponent(this._World, this._Plants)
					)
 					rabbitLoader.Render(this._SceneObj, rabbit); 
					this._Rabbits.Add(rabbit);
					i++;
				}
			});
	}
  
	//#endregion
}