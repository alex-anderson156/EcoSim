import { BehaviourNode } from "../BehaviourNode";
import { ExecutorNode, IExecutorNode } from "../ExecutorNode"; 
import { IExecutionContext } from "../BehaviourTreeExecutor";
import { IBehaviourTreeDataContext } from "../BehaviourTreeDataContext";
 

export class FindFoodSourceNode extends BehaviourNode {

	private _FoodSourceCollectionRefs: Array<EntityCollection>;
 
	constructor(...foodSources: Array<EntityCollection>) {
		super();
		this._FoodSourceCollectionRefs = foodSources;
	}

	public CreateExecutor(): IExecutorNode {
		return new FindFoodSourceExecutor(this._FoodSourceCollectionRefs);
	} 
}

import { HungerComponent } from "../../Components";
import { EntityCollection, Entity, EnitityWithDistance } from "../../Entities";

export class FindFoodSourceExecutor extends ExecutorNode {
   
	private _FoodSourceCollectionRefs: Array<EntityCollection>;

	constructor(foodSources: Array<EntityCollection>) {
		super();
		this._FoodSourceCollectionRefs = foodSources;
	}

	public Init(executionContext: IExecutionContext, dataContext: IBehaviourTreeDataContext): void {
		super.Init(executionContext, dataContext);
	}

	public Process(dataContext: IBehaviourTreeDataContext): void { 

		let closestFoodSource: EnitityWithDistance = null;
		for(let collection of this._FoodSourceCollectionRefs){
			let collectionClosest: EnitityWithDistance = collection.FindClosest(dataContext.Entity) 

			if(!collectionClosest)
				continue;

			if(!closestFoodSource || collectionClosest.Distance < closestFoodSource.Distance) {
				closestFoodSource = collectionClosest;
			} 			
		}

		if(closestFoodSource) {
			dataContext.SetVar('ClosestFoodSource', closestFoodSource.Entity);
			dataContext.SetVar('MoveToPosition', closestFoodSource.Entity.Position);
			this.Success();
		}
		else
			this.Fail();
	} 
}