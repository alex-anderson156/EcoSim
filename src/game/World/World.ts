import { MapTileData } from "./MapTileData"; 
import { IMapRenderer } from "./MapRenderer";
import { EcoScene } from "../_Base/EcoScene";
import { IMapGenerator } from "./MapGenerator";
import { CollisionData } from "./CollisionData";
import { IPoint } from "../_Pathfinding/AStar/Interfaces";

import { Vector2, Vector3 } from 'THREE';

export class World {
	 
	private _MapRenderer: IMapRenderer;

	private _WorldWidth: number
	/**
	 * Gets or sets the maximum width of the world along the X Axis
	 */
	public get WorldWidth(): number { return this._WorldWidth; }
	public set WorldWidth(value: number) { this._WorldWidth = value; }

	private _WorldDepth: number
	/**
	 * Gets or sets the maximum depth of the world along the z-axis.
	 */
	public get WorldDepth(): number { return this._WorldDepth; }
	public set WorldDepth(value: number) { this._WorldDepth = value; }

	private _WorldMaxHeight: number
	/**
	 * Gets or sets the maximum height of the world along the y-axis;
	 */
	public get WorldMaxHeight(): number { return this._WorldMaxHeight; }
	public set WorldMaxHeight(value: number) { this._WorldMaxHeight = value; }
 
	private _WorldMapData: MapTileData[][];
	/**
	 * Gets or sets 
	 */
	public get WorldMapData(): MapTileData[][] { return this._WorldMapData; } 
 
	private _CollisionMap: CollisionData[][];

	private _PathfinderGrid: number[][]
	/**
	 * Gets or sets 
	 */
	public get PathfinderGrid(): number[][] { return this._PathfinderGrid; } 
 
	constructor(
		worldX: number, 
		worldZ: number, 
		maxWorldHeight: number,
		mapGenerator: IMapGenerator,
		mapRenderer: IMapRenderer)
	{		 
		this._WorldWidth = worldX;
		this._WorldDepth = worldZ;
		this._WorldMaxHeight = maxWorldHeight; 
		this._MapRenderer = mapRenderer; 
		this._WorldMapData = mapGenerator.Seed(worldX, worldZ); 
	}
 

	public GetTileData(x: number, z: number): MapTileData {
		return this._WorldMapData[z][x];
	}

	public IsPassable(x: number, z: number): boolean {
		return this._CollisionMap[z][x].IsAccessAllowed;
	}

	public Build(scene: EcoScene): void {	 
		this._MapRenderer.Render(this, scene.SceneObj);

		// Build our Collision Map
		this._CollisionMap = [[]];
		this._PathfinderGrid = [[]];
		for(let z: number = 0; z < this._WorldDepth; z++){
			let array: Array<CollisionData> = new Array<CollisionData>();
			let pathFinderArray: Array<number> = new Array<number>();
			for(let x: number = 0; x < this._WorldWidth; x++) { 
				array[x] = new CollisionData(this._WorldMapData[z][x].Region.IsPassable);
				pathFinderArray[x] = array[x].IsAccessAllowed ? 0 : 1;
			}
			this._CollisionMap[z] = array;
			this._PathfinderGrid[z] = pathFinderArray;
		}
	}

	public PositionToWorld(position: Vector3): Vector2 { 
		return new Vector2(Math.round(position.x), Math.round(position.z));
	}
}