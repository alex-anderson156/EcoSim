import { BehaviourNode } from "../BehaviourNode";
import { ExecutorNode, IExecutorNode } from "../ExecutorNode"; 
import { IExecutionContext } from "../BehaviourTreeExecutor";
import { IBehaviourTreeDataContext } from "../BehaviourTreeDataContext";
 

export class DrinkWaterSourceNode extends BehaviourNode {
 

	constructor() {
		super(); 
	}

	public CreateExecutor(): IExecutorNode {
		return new DrinkWaterSourceExecutor();
	} 
}


import { Clock } from 'THREE';
import { ThirstComponent } from "../../Components";
import { Entity } from "../../Entities";

export class DrinkWaterSourceExecutor extends ExecutorNode {
	   
	private _ClosestWaterSource: Entity = null;
	private _Clock: Clock;

	constructor() {
		super(); 
		this._Clock = new Clock(false);
	}

	public Init(executionContext: IExecutionContext, dataContext: IBehaviourTreeDataContext): void {
		super.Init(executionContext, dataContext); 
		this._ClosestWaterSource = dataContext.GetVar<Entity>('ClosestWaterSource');
		dataContext.ClearVar('ClosestWaterSource');
		this._Clock.start();		
	}

	public Process(dataContext: IBehaviourTreeDataContext): void { 
		if(this._Clock.getElapsedTime() >= 3) {
			dataContext.Entity.GetComponent<ThirstComponent>("ThirstComponent").ReplenishThirst(3);
			this.Success();
		}
		else {
			this.Running();
		} 
	} 
}