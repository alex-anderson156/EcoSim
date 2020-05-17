export class CollisionData {

	private _IsAccessAllowed: boolean
	/**
	 * Gets or sets 
	 */
	public get IsAccessAllowed(): boolean { return this._IsAccessAllowed; }
	public set IsAccessAllowed(value: boolean) { this._IsAccessAllowed = value; }

	constructor(isAccessAllowed: boolean){
		this._IsAccessAllowed = isAccessAllowed;
	}

}