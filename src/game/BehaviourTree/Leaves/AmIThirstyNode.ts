import { BehaviourNode } from "../BehaviourNode";
import { ExecutorNode, IExecutorNode } from "../ExecutorNode"; 
import { IExecutionContext } from "../BehaviourTreeExecutor";
import { IBehaviourTreeDataContext } from "../BehaviourTreeDataContext";
 

export class AmIThirstyNode extends BehaviourNode {

	 
	constructor() {
		super();
	}

	public CreateExecutor(): IExecutorNode {
		return new AmIThirstyNodeExecutor();
	} 
}

import { Clock } from 'THREE';
import { ThirstComponent } from "../../Components";

export class AmIThirstyNodeExecutor extends ExecutorNode {

	constructor() {
		super();
	}

	public Process(dataContext: IBehaviourTreeDataContext): void {  
		const hunger = dataContext.Entity.GetComponent<ThirstComponent>('ThirstComponent');
 
		if(hunger.ThirstPercentage <= 80)
			this.Success();
		else
			this.Fail(); 
	} 
}