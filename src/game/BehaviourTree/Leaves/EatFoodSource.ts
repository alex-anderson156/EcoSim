import { BehaviourNode } from "../BehaviourNode";
import { ExecutorNode, IExecutorNode } from "../ExecutorNode"; 
import { IExecutionContext } from "../BehaviourTreeExecutor";
import { IBehaviourTreeDataContext } from "../BehaviourTreeDataContext";
 

export class EatFoodSourceNode extends BehaviourNode {
 

	constructor() {
		super(); 
	}

	public CreateExecutor(): IExecutorNode {
		return new EatFoodSourceExecutor();
	} 
}


import { Clock } from 'THREE';
import { HungerComponent } from "../../Components";
import { Entity } from "../../Entities";

export class EatFoodSourceExecutor extends ExecutorNode {
	   
	private _ClosestFoodSource: Entity = null;
	private _Clock: Clock;

	constructor() {
		super(); 
		this._Clock = new Clock(false);
	}

	public Init(executionContext: IExecutionContext, dataContext: IBehaviourTreeDataContext): void {
		super.Init(executionContext, dataContext); 
		this._ClosestFoodSource = dataContext.GetVar<Entity>('ClosestFoodSource');
		this._Clock.start();		
	}

	public Process(dataContext: IBehaviourTreeDataContext): void { 
		if(this._Clock.getElapsedTime() >= 3) {
			dataContext.Entity.GetComponent<HungerComponent>("HungerComponent").ReplenishHunger(3);
			this.Success();
		}
		else {
			this.Running();
		} 
	} 
}