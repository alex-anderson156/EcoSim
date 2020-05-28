import { BehaviourNode } from "../BehaviourNode";
import { ExecutorNode, IExecutorNode } from "../ExecutorNode"; 
import { IExecutionContext } from "../BehaviourTreeExecutor";
import { IBehaviourTreeDataContext } from "../BehaviourTreeDataContext";
 

export class FindWaterSourceNode extends BehaviourNode {

	private _WaterSourceCollectionRefs: Array<EntityCollection>;
 
	constructor(...foodSources: Array<EntityCollection>) {
		super();
		this._WaterSourceCollectionRefs = foodSources;
	}

	public CreateExecutor(): IExecutorNode {
		return new FindWaterSourceExecutor(this._WaterSourceCollectionRefs);
	} 
}

import { HungerComponent } from "../../Components";
import { EntityCollection, Entity, EnitityWithDistance } from "../../Entities";

export class FindWaterSourceExecutor extends ExecutorNode {
   
	private _WaterSourceCollectionRefs: Array<EntityCollection>;

	constructor(foodSources: Array<EntityCollection>) {
		super();
		this._WaterSourceCollectionRefs = foodSources;
	}

	public Init(executionContext: IExecutionContext, dataContext: IBehaviourTreeDataContext): void {
		super.Init(executionContext, dataContext);
	}

	public Process(dataContext: IBehaviourTreeDataContext): void { 

		let closestWaterSource: EnitityWithDistance = null;
		for(let collection of this._WaterSourceCollectionRefs){
			let collectionClosest: EnitityWithDistance = collection.FindClosest(dataContext.Entity) 

			if(!collectionClosest)
				continue;

			if(!closestWaterSource || collectionClosest.Distance < closestWaterSource.Distance) {
				closestWaterSource = collectionClosest;
			} 			
		}

		if(closestWaterSource) {
			dataContext.SetVar('ClosestWaterSource', closestWaterSource.Entity);
			dataContext.SetVar('MoveToPosition', closestWaterSource.Entity.Position);
			this.Success();
		}
		else
			this.Fail();
	} 
}