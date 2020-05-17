import { MapTileData } from "./MapTileData"; 
import { IMapRenderer } from "./MapRenderer";
import { EcoScene } from "../_Base/EcoScene";
import { IMapGenerator } from "./MapGenerator";
import { CollisionData } from "./CollisionData";

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
		for(let z: number = 0; z < this._WorldDepth; z++){
			let array: Array<CollisionData> = new Array<CollisionData>();
			for(let x: number = 0; x < this._WorldWidth; x++) { 
				array[x] = new CollisionData(this._WorldMapData[z][x].Region.IsPassable);
			}
			this._CollisionMap[z] = array;
		}
	}
}