import { Color } from 'THREE';
 
export class Region {

	private _Name: string
	/**
	 * Gets or sets 
	 */
	public get Name(): string { return this._Name; }
	public set Name(value: string) { this._Name = value; }

	private _Level: number
	/**
	 * Gets or sets 
	 */
	public get Level(): number { return this._Level; }
	public set Level(value: number) { this._Level = value; }

	private _Colour: Color
	/**
	 * Gets or sets 
	 */
	public get Colour(): Color { return this._Colour; }
	public set Colour(value: Color) { this._Colour = value; }

	private _IsPassable: boolean
	/**
	 * Gets or sets 
	 */
	public get IsPassable(): boolean { return this._IsPassable; }
	public set IsPassable(value: boolean) { this._IsPassable = value; }

	private _CanHaveTrees: boolean
	/**
	 * Gets or sets 
	 */
	public get CanHaveTrees(): boolean { return this._CanHaveTrees; }
	public set CanHaveTrees(value: boolean) { this._CanHaveTrees = value; }

	
 
	constructor(name: string, maxHeightLevel: number, color: Color, isPassable: boolean, canHaveTrees: boolean = false){
		this._Name = name;
		this._Level = maxHeightLevel;
		this._Colour = color;
		this._CanHaveTrees = canHaveTrees;
		this._IsPassable = isPassable;
	}
}