
import { WebGLRenderer, Color } from 'THREE';  
import { EcoScene } from './_Base/EcoScene';
import { SimulationScene, DevViewerScene } from './_Scenes';
import { IGameArgs, GameModeType } from './IGameArgs'; 

import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';

export class Game {

	private _Renderer: WebGLRenderer;
	private _CSS2DRenderer: CSS2DRenderer;
	private _CSS3DRenderer: CSS3DRenderer;
	private _CurrentScene: EcoScene; 


	constructor() {
		this._Renderer = null; 
		this._CurrentScene = null;
	}

	public Run(args: IGameArgs){
		console.log('Starting ....');

		this._Renderer = new WebGLRenderer({ logarithmicDepthBuffer: true });
		this._Renderer.shadowMap.enabled = true;
		this._Renderer.setSize( window.innerWidth, window.innerHeight);
		this._Renderer.setClearColor(new Color(0x708090));
  
		document.body.appendChild(this._Renderer.domElement); 
		window.addEventListener('resize', this.OnWindowResize);

		this._CSS2DRenderer = new CSS2DRenderer();
		this._CSS2DRenderer.setSize( window.innerWidth, window.innerHeight );
		this._CSS2DRenderer.domElement.style.position = 'absolute';
		this._CSS2DRenderer.domElement.style.top = '0px';
		document.body.appendChild( this._CSS2DRenderer.domElement );

		this._CSS3DRenderer = new CSS3DRenderer();
		this._CSS3DRenderer.setSize( window.innerWidth, window.innerHeight );
		this._CSS3DRenderer.domElement.style.position = 'absolute';
		this._CSS3DRenderer.domElement.style.top = '0px';
		document.body.appendChild( this._CSS3DRenderer.domElement );

		// Load up Assets
		console.log('Loading Initial Scene ....');
		this._CurrentScene = this.CreateInitialScene(args.GameMode);
		this._CurrentScene.LoadContent()
			.then(() => {
				console.log('Initial Scene loading complete.');
				this._CurrentScene.BuildScene(this._Renderer, this._CSS2DRenderer, this._CSS3DRenderer);				
				console.log('Starting Game Loop.');
				this.DoGameLoop();
			}); 
	}

	private DoGameLoop() {  
  
		this._CurrentScene.Update();
		this._CurrentScene.Render(this._Renderer, this._CSS2DRenderer, this._CSS3DRenderer); 		

		requestAnimationFrame(() => {this.DoGameLoop();});
	}

	private OnWindowResize = () => {
		this._Renderer.setSize(window.innerWidth, window.innerHeight);	
		this._CSS2DRenderer.setSize(window.innerWidth, window.innerHeight);	
		this._CSS3DRenderer.setSize(window.innerWidth, window.innerHeight);	

		this._CurrentScene.UpdateForResize(window.innerWidth, window.innerHeight);
	}


	public CreateInitialScene(gameMode: GameModeType): EcoScene {

		switch (gameMode) {
			case GameModeType.DEV_VIEWER:
				console.log('Loading DevViewer ...');
				return new DevViewerScene();

			case GameModeType.SIMULATION:
				console.log('Starting new Simulation ...');
				return new SimulationScene();
		
			default:
				throw 'Invalid Game mode specified.';
		}

	}
}