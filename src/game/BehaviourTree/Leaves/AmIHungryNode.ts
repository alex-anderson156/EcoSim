import { BehaviourNode } from "../BehaviourNode";
import { ExecutorNode, IExecutorNode } from "../ExecutorNode"; 
import { IExecutionContext } from "../BehaviourTreeExecutor";
import { IBehaviourTreeDataContext } from "../BehaviourTreeDataContext";
 

export class AmIHungryNode extends BehaviourNode {

	 
	constructor() {
		super();
	}

	public CreateExecutor(): IExecutorNode {
		return new AmIHungryNodeExecutor();
	} 
}

import { Clock } from 'THREE';
import { HungerComponent } from "../../Components";

export class AmIHungryNodeExecutor extends ExecutorNode {

	constructor() {
		super();
	}

	public Process(dataContext: IBehaviourTreeDataContext): void {  
		const hunger = dataContext.Entity.GetComponent<HungerComponent>('HungerComponent');
 
		if(hunger.HungerPercentage <= 60)
			this.Success();
		else
			this.Fail(); 
	} 
}