import { Entity, EntityCollection } from "../Entities";
import { HungerComponent, ThirstComponent } from "../Components";

import * as _ from 'lodash';

/**
 * A Generic System for managing basic needs of entities that are not handled by other systems.
 */
export class EntitySystem {

	public _Entities: EntityCollection;

	constructor() {
		this._Entities = new EntityCollection();
	}

	public Add(...entities: Array<Entity>) { 
		this._Entities.Add(...entities) ;
	}

	public AddCollections(...entities: Array<EntityCollection>) { 
		this.Add(..._.flatten(_.map(entities, ec => ec.Entities)));
	}
 
	public Update() {
 
		// 
		for(let entity of this._Entities.Entities) {
			
			// Hunger
			let hungerComponent = entity.GetComponent<HungerComponent>('HungerComponent');
			if (hungerComponent) {
				hungerComponent.Update();

				if(hungerComponent.HungerPercentage <= 0) {
					this.Kill(entity);
					continue;
				}
			}

			// Thirst
			let thirstComponent = entity.GetComponent<ThirstComponent>('ThirstComponent');
			if (thirstComponent) {
				thirstComponent.Update();

				if(thirstComponent.ThirstPercentage <= 0) {
					this.Kill(entity);
					continue;
				}
			}
		}
	}


	private Kill(entity: Entity) {
		console.log('Entity has sadly died.', entity);
	}
}