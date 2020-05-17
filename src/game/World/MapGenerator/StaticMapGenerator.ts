import { IMapGenerator } from "./_IMapGenerator";
import { MapTileData } from "../MapTileData";
import { Noise } from "../../_System/Noise";

 
export class StaticMapGenerator implements IMapGenerator {
	private _WorldDef: number[][];

	constructor(world: number[][]){
		this._WorldDef = world;
	}
 
	public Seed(width: number, depth: number): MapTileData[][] {
		if(depth != this._WorldDef.length)
			throw 'Worlds of incompatible depth';

		if(width != this._WorldDef[0].length)
			throw 'Worlds of incompatible width';

		let returnMap: MapTileData[][] = [[]];
		for(let z = 0; z < depth; z++) {
			let array: Array<MapTileData> = [];
			for(let x = 0; x <width; x++) {
				array[x] = new MapTileData(this._WorldDef[z][x]);
			}
			returnMap[z] = array;
		}

		return returnMap;
	}
}