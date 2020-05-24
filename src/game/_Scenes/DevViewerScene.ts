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

import { BehaviourTree, RepeaterNode, SequenceNode, PickRandomTargetNode, MoveToTargetNode, BehaviourTreeExecutor, PauseNode } from '../BehaviourTree'
import { RabbitRenderer } from '../Entities';

export class DevViewerScene extends EcoScene {
	//#region Game Session Vars
	private _World: World;

	//#endregion


	constructor() {
		super();
	}

	//#region Public Methods

	public LoadContent(): Promise<void> {		 
		this._RabbitRenderer = new RabbitRenderer();
		
		
		return this._RabbitRenderer.Load()
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
		//regionDict.Add('DeepWater', 	new Region('Water', 0.1, new Color(0x2b7897), false));
		//regionDict.Add('Water', 		new Region('Water', 0.2, new Color(0x45a4ca), false));
		//regionDict.Add('ShallowWater', 	new Region('Water', 0.3, new Color(0x81c1db), false));
 		
		//regionDict.Add('Sand', 	new Region('Sand', 0.4, new Color(0xceee8aa), true)); 	
		 
		regionDict.Add('Grass',  new Region('Grass', 0.6, new Color(0x2cb42c), true));
		regionDict.Add('Grass1', new Region('Grass', 0.7, new Color(0x279f27), true));
		regionDict.Add('Grass2', new Region('Grass', 0.8, new Color(0x228b22), true));
		regionDict.Add('Grass3', new Region('Grass', 0.9, new Color(0x1d771d), true, true));
		regionDict.Add('Grass4', new Region('Grass', 1.1, new Color(0x186218), true, true));
  

		this._World = new World(
			11, 11, 11,
			new PerlinNoiseMapGenerator(),
			new MapRenderer(regionDict)
		);
		this._World.Build(this);		

		this._RabbitBT = new BehaviourTree(
			new RepeaterNode(
				new SequenceNode(
					new PickRandomTargetNode(),
					new MoveToTargetNode(),
					new PauseNode(2)
				)
			)
		);

		this._Rabbits = new Array<Entities.Rabbit>();
		this._RabbitBTExecutors = new Array<BehaviourTreeExecutor>();
		
		for(let i: number = 0; i <= 25; i++) {
			let randX: number = Math.floor(Math.random() * this._World.WorldWidth);
			let randZ: number = Math.floor(Math.random() * this._World.WorldDepth);


			let rabbit = new Entities.Rabbit(new Vector3(randX, 1.15, randZ));
			rabbit.AddComponents(
				new Components.HopMovementComponent(.2)
			)

			this._Rabbits.push(rabbit);
			this._RabbitRenderer.Render(this._SceneObj, rabbit);

			let rabbitBTExecutor = new BehaviourTreeExecutor(this._RabbitBT, rabbit);
			rabbitBTExecutor.Init();
			this._RabbitBTExecutors.push(rabbitBTExecutor);
		}
	}


	private _Rabbits: Array<Entities.Rabbit>;
	private _RabbitRenderer: RabbitRenderer;
	private _RabbitBT: BehaviourTree;
	private _RabbitBTExecutors: Array<BehaviourTreeExecutor>;
 
	public Update(): void {
		for(let rabbitBTExecutor of this._RabbitBTExecutors)
			rabbitBTExecutor.Update();	
	}

	//#endregion


	//#region Private Methods

	//#endregion

	//#region Events

	//#endregion
}