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

import * as Entities from '../Entities'; 
import * as Components from '../Components';  

import { BehaviourTree, RepeaterNode, SequenceNode, PickRandomTargetNode, MoveToTargetNode, BehaviourTreeExecutor, PauseNode, AmIHungryNode, EatFoodSourceNode, FindFoodSourceNode, SuccessorNode } from '../BehaviourTree' 
import { BehaviourTreeSystem } from '../Systems/BehaviourTreeSystem'; 
import { EntitySystem } from '../Systems'; 
import { DeveloperConsole } from '../UI/DeveloperConsole/DeveloperConsole';
import { MoveToDevCommand, SetThirstCommand } from './MoveToDevCommand';
import { SelectorNode } from '../BehaviourTree/Composite/SelectorNode';
import { AmIThirstyNode } from '../BehaviourTree/Leaves/AmIThirstyNode';
import { FindWaterSourceNode } from '../BehaviourTree/Leaves/FindWaterSource';
import { DrinkWaterSourceNode } from '../BehaviourTree/Leaves/DrinkWaterSource';

export class DevViewerScene extends EcoScene {
	//#region Game Session Vars
	private _World: World;

	private _RabbitBT: BehaviourTree;
	private _Rabbits: Entities.EntityCollection;
	private _RabbitRenderer: Entities.RabbitRenderer;	

	private _Plants: Entities.EntityCollection;
	private _PlantRenderer: Entities.PlantRenderer;

	private _WaterSources: Entities.EntityCollection;
	private _WaterSourceRenderer: Entities.WaterSourceRenderer;

	private _BehaviourTreeSystem: BehaviourTreeSystem;
	private _EntitySystem: EntitySystem;

	//#endregion


	constructor() {
		super();
	}

	//#region Public Methods

	public LoadContent(): Promise<void> {	
		
		let promises: Array<Promise<any>> = new Array<Promise<any>>();
 
		this._RabbitRenderer = new Entities.RabbitRenderer();
		promises.push(this._RabbitRenderer.Load());
 
		this._PlantRenderer = new Entities.PlantRenderer();
		promises.push(this._PlantRenderer.Load());
				
		this._WaterSourceRenderer = new Entities.WaterSourceRenderer();
		promises.push(this._WaterSourceRenderer.Load());

		this._BehaviourTreeSystem = new BehaviourTreeSystem();
		this._EntitySystem = new EntitySystem();
		
		return Promise.all(promises)
			.then(() => { 
				
			});
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
		pointLight.position.set(5, 50, 5);
		pointLight.castShadow = true;
		let pointLightHelper: PointLightHelper = new PointLightHelper(pointLight); 

		this._SceneObj.add(pointLight)
		this._SceneObj.add(pointLightHelper); 
		 
		let regionDict = new Dictionary<Region>(); 
		 
		regionDict.Add('Water',  new Region('Water', 0.8, new Color(0x45a4ca), false, false, true));  
		regionDict.Add('Grass',  new Region('Grass', 1.1, new Color(0x2cb42c), true)); 
   
		this._World = new World(
			5, 5, 5,
			new StaticMapGenerator(
				[
					[1,1,1,1,1],
					[1,1,1,1,1],
					[1,1,1,1,1],
					[0,1,1,1,0],
					[0,0,0,0,0],
				]
			),
			new MapRenderer(regionDict)
		);
		this._World.Build(this);
 
		this._Rabbits = new Entities.EntityCollection();
		this._Plants = new Entities.EntityCollection();
  
		this.SeedWaterSources();

		// --
		// Create plants
		for (let i = 0; i < 1; ) {
			//let randX: number = Math.floor(Math.random() * this._World.WorldWidth);
			//let randZ: number = Math.floor(Math.random() * this._World.WorldDepth);

			//if(!this._World.IsPassable(randX, randZ)) { 
			//	continue; 
			//} 

			let plant: Entities.Entity = new Entities.Entity(new Vector3(2, 1, 2));
			plant.AddComponents( 
				new Components.NameplateComponent(),
			);	

			this._Plants.Add(plant);
			this._PlantRenderer.Render(this._SceneObj, plant);
			i++;
		}

		this._RabbitBT = new BehaviourTree(
			new RepeaterNode(
				new SelectorNode(
					// FIND WATER 
					new SequenceNode(
						new AmIThirstyNode(),
						new FindWaterSourceNode(this._WaterSources),
						new MoveToTargetNode(),
						new DrinkWaterSourceNode()
					),

					//// FIND FOOD 
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
 
		// --
		// Create Rabbits
		for(let i: number = 0; i < 3 ; ) {
			let randX: number = Math.floor(Math.random() * this._World.WorldWidth);
			let randZ: number = Math.floor(Math.random() * this._World.WorldDepth);

			if(!this._World.IsPassable(randX, randZ)) { 
				continue; 
			} 

			let rabbit = new Entities.Entity(new Vector3(randX, 1, randZ));
			rabbit.AddComponents(
				new Components.HopMovementComponent(.2, this._World),
				new Components.NameplateComponent(),
				new Components.HungerComponent(10, 3),
				new Components.ThirstComponent(10)
			);

			this._Rabbits.Add(rabbit);
			this._RabbitRenderer.Render(this._SceneObj, rabbit); 
			this._BehaviourTreeSystem.Add(new BehaviourTreeExecutor(this._RabbitBT, rabbit));

			i++;
		} 

		this._EntitySystem.AddCollections(this._Rabbits);
		DeveloperConsole.Register(new MoveToDevCommand(this._World, this._Rabbits.Entities[0]));
		DeveloperConsole.Register(new SetThirstCommand(this._Rabbits));
	}
 
	public Update(): void {	
		this._EntitySystem.Update();	 
		this._BehaviourTreeSystem.Update();
	}

	//#endregion


	//#region Private Methods

	private SeedWaterSources() {
		this._WaterSources = new Entities.EntityCollection();
		
		for(let z = 0 ; z < this._World.WorldDepth; z++) {
			for(let x = 0 ; x < this._World.WorldWidth; x++) {				 
				const tileData = this._World.GetTileData(x, z);
				if(!tileData.Region.IsWaterSource)
					continue;

				let directions: Array<[number, number]> = [
					[1,  0],
					[0,  1],
					[-1, 0],
					[0, -1]
				]

				for(let direction of directions) {
					const targetPos: Vector3 = new Vector3(x + (direction[0] * .6), 1, z + (direction[1] * .6));
					const directionCell: Vector3 = new Vector3(x + direction[0], 1, z + direction[1]);

					if(!this._World.IsInWorldCoords(directionCell))
						continue;
 
					if(!this._World.GetTileData(directionCell.x, directionCell.z).Region.IsPassable)
						continue;

					let waterSource: Entities.WaterSource = new Entities.WaterSource(targetPos);
					this._WaterSources.Add(waterSource);
					this._WaterSourceRenderer.Render(this._SceneObj, waterSource); 
				}

				
			}
		}
	}

	//#endregion

	//#region Events

	//#endregion
}
 