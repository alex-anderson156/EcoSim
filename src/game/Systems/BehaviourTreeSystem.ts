import { BehaviourTree } from "../BehaviourTree/BehaviourTree";
import { IBehaviourNode } from "../BehaviourTree/BehaviourNode";
import { BehaviourNodeState } from "../BehaviourTree/BehaviourNodeState";
import { BehaviourTreeDataContext } from "../BehaviourTree/BehaviourTreeDataContext";
import { Dictionary } from "../_System/Dictionary";
import { Entity } from "../Entities";
import { BehaviourTreeExecutor } from "../BehaviourTree";

 
export class BehaviourTreeSystem {

	private _BehaviourTreeExecutors: Array<BehaviourTreeExecutor>; 
 
	constructor() {
		this._BehaviourTreeExecutors = new Array<BehaviourTreeExecutor>();
	}
 
	public Add(executor: BehaviourTreeExecutor) {
		this._BehaviourTreeExecutors.push(executor);
		executor.Init();
	}

	public Update() {
		for(let executor of this._BehaviourTreeExecutors)
			executor.Update();
	}
}