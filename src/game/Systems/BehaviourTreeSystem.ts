import { BehaviourTree } from "../BehaviourTree/BehaviourTree";
import { IBehaviourNode } from "../BehaviourTree/BehaviourNode";
import { BehaviourNodeState } from "../BehaviourTree/BehaviourNodeState";
import { BehaviourTreeDataContext } from "../BehaviourTree/BehaviourTreeDataContext";
import { Dictionary } from "../_System/Dictionary";
import { Entity } from "../Entities";


class EntityCacheObject {
	public Entity: Entity;
	
	public DataContext: BehaviourTreeDataContext;

	constructor(entity: Entity) {
		this.Entity = entity;
		this.DataContext = new BehaviourTreeDataContext(entity);
	}
}

export class BehaviourTreeSystem {

	private _BehaviourTree: BehaviourTree;

	private _EntityCache: Dictionary<EntityCacheObject>;

	constructor(behaviourTree: BehaviourTree) {
		this._BehaviourTree = behaviourTree;

	}
 
}