import { Scene } from 'THREE'; 
import { World } from '../World';

export interface IMapRenderer {
	Render(map: World, scene: Scene): void;
}