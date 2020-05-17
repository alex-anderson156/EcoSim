import { IMapGenerator } from "./_IMapGenerator";
import { MapTileData } from "../MapTileData";
import { Noise } from "../../_System/Noise";

 
export class PerlinNoiseMapGenerator implements IMapGenerator {
 
	public Seed(width: number, depth: number): MapTileData[][] {
		
		let noiseFn = new Noise(width, depth);
		noiseFn.Generate();

		let returnMap: MapTileData[][] = [[]];
		for(let z = 0; z < depth; z++) {
			let array: Array<MapTileData> = [];
			for(let x = 0; x <width; x++) {

				let noiseMapHeight: number = noiseFn.GetValue(x, z);
				array[x] = new MapTileData(noiseMapHeight);
			}
			returnMap[z] = array;
		}

		return returnMap;
	}
}