import { BehaviourTree } from "./BehaviourTree";
import { Entity } from "../Entities";
import { IExecutorNode } from "./ExecutorNode";
import { BehaviourTreeDataContext, IBehaviourTreeDataContext } from "./BehaviourTreeDataContext";

import * as _ from 'lodash';

export interface IExecutionContext {
	AddExecutable(executor: IExecutorNode): void;
	RemoveExecutable(executor: IExecutorNode): void;
}

export class BehaviourTreeExecutor implements IExecutionContext {

	private readonly _BehaviourTree: BehaviourTree;
	private readonly _Entity: Entity;

	private _DataContext: IBehaviourTreeDataContext;

	private _ActiveNodes: Array<IExecutorNode>;
	private _NodesAwaitingActivation: Array<IExecutorNode>;
	private _NodesAwaitingRemoval: Array<IExecutorNode>;

	/**
	 * 
	 * @param bt 
	 * @param entity 
	 */
	constructor(bt: BehaviourTree, entity: Entity) {
		this._BehaviourTree = bt;
		this._Entity = entity;
	}


	public AddExecutable(executor: IExecutorNode): void { 
		//console.log('Adding BT node: ', executor);
		this._NodesAwaitingActivation.push(executor);
	}

	public RemoveExecutable(executor: IExecutorNode): void { 
		//console.log('Removing BT node: ', executor);
		this._NodesAwaitingRemoval.push(executor);
	}

	public Init() { 
		this._ActiveNodes = new Array<IExecutorNode>();
		this._NodesAwaitingActivation = new Array<IExecutorNode>();
		this._NodesAwaitingRemoval = new Array<IExecutorNode>();
		this._DataContext = new BehaviourTreeDataContext(this._Entity);

		this.InternalSpawn(this._BehaviourTree.RootNode.CreateExecutor());
	}

	public Update() {
		// Process Active Nodes 
		// TODO AA : Do we really need to process all active nodes, or only the top level one?
		//  I think we can get away with only the top level node if it returns RUNNING.
		//  Q. What about parallel running?  
		// _.reverse(...) mutates the array, which is bad m'kay.
		// [...this._ActiveNodes] creates a new copy of the array which we can safely reverse.
		let processQueue  =  _.reverse([...this._ActiveNodes]); 
		for (let activeNode of processQueue) {
			activeNode.Process(this._DataContext);
		}

		// Cleanup.
		for (let nodeToRemove of this._NodesAwaitingRemoval) {
			 const index: number = _.indexOf(this._ActiveNodes, nodeToRemove);
			 this._ActiveNodes.splice(index, 1);
		}

		for (let nodeToAdd of this._NodesAwaitingActivation) {
			this.InternalSpawn(nodeToAdd);
		}

		this._NodesAwaitingRemoval.splice(0);
		this._NodesAwaitingActivation.splice(0); 
	}


	//#region Private Methods

	private InternalSpawn(executorNode: IExecutorNode) {
		executorNode.Init(this, this._DataContext);
		this._ActiveNodes.push(executorNode);
	}

	//#endregion Private Methods

}