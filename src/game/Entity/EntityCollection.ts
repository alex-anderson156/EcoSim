import { Entity } from "./Entity";

export class EntityCollection<E extends Entity> {

	//#region Properties

	private _Entities: Array<E>;
	public get Entities(): Array<E> { return this._Entities; }

	//#endregion

	constructor() {
		this._Entities = new Array<E>();
	}

	//#region Public Methods

	public Add(entity: E) : void {
		this._Entities.push(entity);
	}

	public FindClosest(searcher: Entity) {

	}

	//#endregion

	//#region Protected Methods

	//#endregion

	//#region Private Methods

	//#endregion
}