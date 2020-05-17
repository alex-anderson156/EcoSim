import { IMapGenerator } from "./_IMapGenerator";
import { MapTileData } from "../MapTileData"; 
 
export class CellularAutomaMapGenerator implements IMapGenerator {
 
	public Seed(width: number, depth: number): MapTileData[][] {
		let returnMap: MapTileData[][] = [[]];
		for(let z = 0; z < depth; z++) {
			let array: Array<MapTileData> = [];
			for(let x = 0; x <width; x++) {
				array[x] = new MapTileData(1);
			}
			returnMap[z] = array;
		}

		return returnMap;
	}
}