import { Region } from "./Region";

export class MapTileData {

	private _Value: number
	/**
	 * Gets or sets the height at this location
	 */
	public get Value(): number { return this._Value; }
	public set Value(value: number) { this._Value = value; }

	private _Region: Region
	/**
	 * Gets or sets the region that this cell represents.
	 */
	public get Region(): Region { return this._Region; }
	public set Region(value: Region) { this._Region = value; }

	constructor(value: number) {
		this._Value = value;
	}
}
 