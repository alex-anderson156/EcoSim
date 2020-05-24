import { Dictionary } from "../_System/Dictionary";
import { Entity } from "../Entities";


export interface IBehaviourTreeDataContext {

	Entity: Entity;

	SetVar<T>(key: string, value: T): void;
	GetVar<T>(key: string): T; 
	ClearVar(key: string): boolean;
}

export class BehaviourTreeDataContext implements IBehaviourTreeDataContext {

	private _VarStore: Dictionary<any>;	
	public readonly Entity: Entity;

	constructor(entity: Entity) {
		this.Entity = entity;
		this._VarStore = new Dictionary<any>();
	}


	public SetVar<T>(key: string, value: T) {
		this._VarStore.SetValue(key, value);
	}
	
	public GetVar<T>(key: string): T {
		return <T>this._VarStore.GetValue(key);
	}

	public ClearVar(key: string) {
		return this._VarStore.Remove(key);
	}
}
