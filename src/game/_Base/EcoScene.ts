import { WebGLRenderer, Scene, Camera, PerspectiveCamera } from 'THREE';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';

export abstract class EcoScene {

	protected _SceneObj: Scene
	/**
	 * Gets or sets 	
	 */
	public get SceneObj(): Scene { return this._SceneObj; }
	public set SceneObj(value: Scene) { this._SceneObj = value; }

	
	protected _Camera: Camera;

	constructor() {
		this._SceneObj = new Scene();
	}
 
	public abstract LoadContent(): Promise<void>;

	public abstract BuildScene(wegGLRenderer: WebGLRenderer, css2drenderer: CSS2DRenderer, css3drenderer: CSS3DRenderer): void;

	public abstract Update(): void;

	public Render(renderer: WebGLRenderer, css2drenderer: CSS2DRenderer, css3drenderer: CSS3DRenderer): void {
		renderer.render(this._SceneObj, this._Camera);
		css2drenderer.render(this._SceneObj, this._Camera);
		css3drenderer.render(this._SceneObj, this._Camera);
	}
 
	public UpdateForResize(newWindowWidth: number, newWindowHeight: number): void {
		if(this._Camera instanceof PerspectiveCamera){
			this._Camera.aspect = newWindowWidth / newWindowHeight;
			this._Camera.updateProjectionMatrix();
		}
	}
	
}