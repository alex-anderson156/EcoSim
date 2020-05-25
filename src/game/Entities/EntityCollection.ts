import { Entity } from "./Entity";

import * as _ from 'lodash'

export class EntityCollection {

	//#region Properties

	private _Entities: Array<Entity>;
	public get Entities(): Array<Entity> { return this._Entities; }

	//#endregion

	constructor() {
		this._Entities = new Array<Entity>();
	}

	//#region Public Methods

	public Add(...entities: Array<Entity>) : void {
		this._Entities.push(...entities);
	}

	public Remove(entity: Entity): void {
		let index: number = _.indexOf(this._Entities, entity);
		this._Entities.splice(index, 1);
	}

	public FindClosest(searcher: Entity): EnitityWithDistance {
		return _.chain(this._Entities) 			
			.map(e => new EnitityWithDistance(e, searcher.Position.distanceToSquared(e.Position)))
			.sortBy(e => e.Distance)
			.first()
			.value();
	}

	//#endregion

	//#region Protected Methods

	//#endregion

	//#region Private Methods

	//#endregion
}

export class EnitityWithDistance {
	
	public readonly Entity: Entity;

	public readonly Distance: number;
 

	constructor(entity: Entity, distance: number) {
		this.Entity = entity;
		this.Distance = distance;
	}
}