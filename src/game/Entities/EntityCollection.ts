import { Entity } from "./Entity";

import * as _ from 'lodash'

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

	public Remove(entity: E): void {
		let index: number = _.indexOf(this._Entities, entity);
		this._Entities.splice(index, 1);
	}

	public FindClosest(searcher: Entity) {
		return _.chain(this._Entities)
			.map(e => searcher.Position.distanceTo(e.Position))
			.sort()
			.first()
			.value();
	}

	//#endregion

	//#region Protected Methods

	//#endregion

	//#region Private Methods

	//#endregion
}