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
import * as Systems from '../Systems';
 
import { BehaviourTree, RepeaterNode, SequenceNode, PickRandomTargetNode, MoveToTargetNode, BehaviourTreeExecutor, PauseNode, AmIHungryNode, EatFoodSourceNode, FindFoodSourceNode } from '../BehaviourTree' 
import { SelectorNode } from '../BehaviourTree/Composite/SelectorNode';

export class SimulationScene extends EcoScene {

	//#region Properties

	private _World: World;
 
	private _RabbitBT: BehaviourTree;
	private _Rabbits: Entities.EntityCollection;
	private _RabbitRenderer: Entities.RabbitRenderer;	

	private _Plants: Entities.EntityCollection;
	private _PlantRenderer: Entities.PlantRenderer;


	private _TreeRenderer: Entities.TreeRenderer;

	private _EntitySystem: Systems.EntitySystem;
	private _BehaviourTreeSystem: Systems.BehaviourTreeSystem;

	//#endregion

	/**
	 * Initialises a new instance of the SimulationScene
	 */
	constructor() {
		super();
	}



	public LoadContent(): Promise<void> { 
		let promises: Array<Promise<any>> = new Array<Promise<any>>();
		
		this._RabbitRenderer = new Entities.RabbitRenderer();
		promises.push(this._RabbitRenderer.Load());
 
		this._PlantRenderer = new Entities.PlantRenderer();
		promises.push(this._PlantRenderer.Load());

		this._TreeRenderer = new Entities.TreeRenderer();
		promises.push(this._TreeRenderer.Load());

		this._BehaviourTreeSystem = new Systems.BehaviourTreeSystem();
		
		return Promise.all(promises)
			.then(() => { 
				
			});
	}

	public BuildScene(wegGLRenderer: WebGLRenderer, css2drenderer: CSS2DRenderer, css3drenderer: CSS3DRenderer): void {	
		this._Camera = new PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000); 
		this._Camera.position.z = 10 ;
		this._Camera.position.y = 10 ;

		let ambientLight: AmbientLight = new AmbientLight(0x404040, 1);  
		this._SceneObj.add(ambientLight);

		let pointLight: PointLight = new PointLight(0x404040, 3, 500, 2);
		pointLight.position.set(31.5, 100, 31.5);
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

		this._EntitySystem = new Systems.EntitySystem();
		this._EntitySystem.AddCollections(this._Plants, this._Rabbits)
	}
  
	public Update(): void {

		
		this._BehaviourTreeSystem.Update();
	}	

	//#region Private Methods

	private SeedTrees(count: number) {
		 
		for(let i = 0 ; i < count;) {
			let randX: number = Math.floor(Math.random() * this._World.WorldWidth)
			let randZ: number = Math.floor(Math.random() * this._World.WorldDepth)

			if(!this._World.IsPassable(randX, randZ)) {
				continue;
			}

			this._TreeRenderer.Render(this._SceneObj, new Entities.Tree(new Vector3(randX, 1, randZ)));
			i++
		} 
	}

	private SeedPlants(count: number) {
		this._Plants = new Entities.EntityCollection();
		
		for(let i = 0 ; i < count; ) {
			let randX: number = Math.floor(Math.random() * this._World.WorldWidth)
			let randZ: number = Math.floor(Math.random() * this._World.WorldDepth)

			if(!this._World.IsPassable(randX, randZ)) {	
				continue;
			}

			let plant: Entities.Plant = new Entities.Plant(new Vector3(randX, 1, randZ));
			this._Plants.Add(plant);

			this._PlantRenderer.Render(this._SceneObj, plant);				
			i++
		}
	}

	private SeedRabbits(count: number) {
		this._Rabbits = new Entities.EntityCollection();
		
		this._RabbitBT = new BehaviourTree(
			new RepeaterNode(
				new SelectorNode(
					// FIND FOOD 
					new SequenceNode(
						new AmIHungryNode(),
						new FindFoodSourceNode(this._Plants),
						new MoveToTargetNode(),
						new EatFoodSourceNode()
					),

					// ROAM
					new SequenceNode(
						new PickRandomTargetNode(this._World),
						new MoveToTargetNode(),
						new PauseNode(2)
					)
				) 
			)
		);

		for(let i = 0 ; i < count;) {
			let randX: number = Math.floor(Math.random() * this._World.WorldWidth)
			let randZ: number = Math.floor(Math.random() * this._World.WorldDepth)

			if(!this._World.IsPassable(randX, randZ)) {	
				continue;
			}
			
			let rabbit: Entities.Rabbit = new Entities.Rabbit(new Vector3(randX, 1.15, randZ), this._World);					
			
			this._BehaviourTreeSystem.Add(new BehaviourTreeExecutor(this._RabbitBT, rabbit));			
			this._Rabbits.Add(rabbit);
			this._RabbitRenderer.Render(this._SceneObj, rabbit); 
			i++;
		} 
	}
  
	//#endregion
}