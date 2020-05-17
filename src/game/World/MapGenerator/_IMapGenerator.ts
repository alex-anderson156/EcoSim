import { MapTileData } from "../MapTileData";

export interface IMapGenerator {
	Seed(width: number, depth: number): MapTileData[][];
}