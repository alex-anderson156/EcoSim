import { PerspectiveCamera, AxesHelper, AmbientLight } from 'THREE';
import { EcoScene } from "../_Base/EcoScene"; 


export class SimulationScene extends EcoScene {




	public LoadContent(): Promise<void> {

		return Promise.resolve();
	}

	public BuildScene(): void {		
		this._Camera = new PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000 );  

		let axisHelper = new AxesHelper();
		this._SceneObj.add(axisHelper);

		let ambientLight: AmbientLight = new AmbientLight(0x404040, 1); 
		this._SceneObj.add(ambientLight);
	}
  
	public Update(): void {


	}

	
}