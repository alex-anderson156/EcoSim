import { BehaviourNode } from "../BehaviourNode";
import { ExecutorNode, IExecutorNode } from "../ExecutorNode"; 
import { IExecutionContext } from "../BehaviourTreeExecutor";
import { IBehaviourTreeDataContext } from "../BehaviourTreeDataContext";
 

export class PauseNode extends BehaviourNode {

	private _PauseDuration: number;

	constructor(durationInSeconds: number) {
		super();
		this._PauseDuration = durationInSeconds;
	}

	public CreateExecutor(): IExecutorNode {
		return new PauseNodeExecutor(this._PauseDuration);
	} 
}

import { Clock } from 'THREE';

export class PauseNodeExecutor extends ExecutorNode {
  	private _PauseDuration: number;

	private _Clock: Clock;

	constructor(durationInSeconds: number) {
		super();
		this._PauseDuration = durationInSeconds;
		this._Clock = new Clock(false);
	}

	public Init(executionContext: IExecutionContext, dataContext: IBehaviourTreeDataContext): void {
		super.Init(executionContext, dataContext);
		this._Clock.start();
	}

	public Process(dataContext: IBehaviourTreeDataContext): void { 
		if(this._Clock.getElapsedTime() >= this._PauseDuration) {
			this.Success();
			return;
		} 
	} 
}