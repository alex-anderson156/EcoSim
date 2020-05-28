import { IDevCommand } from "../UI/DeveloperConsole/Commands/IDevCommand";
import { IDeveloperConsoleContext, LogSeverity } from "../UI/DeveloperConsole/DeveloperConsole";

import * as Entities from '../Entities';

import { Vector3 } from 'THREE';
import { MovementComponent, HungerComponent, ThirstComponent } from "../Components";
import { World } from "../World";
import { Dictionary } from "lodash";


export class SetHungerCommand implements IDevCommand {
	Keyword: string = 'sethunger';
	Format: string = '$value$';

	private _EntitiesToAct: Entities.EntityCollection; 

	constructor(actors: Entities.EntityCollection) { 
		this._EntitiesToAct = actors;
	}

	Execute(console: IDeveloperConsoleContext, args: Dictionary<any>): void {
		
		for(let entity of this._EntitiesToAct.Entities){
			let hungerComp = entity.GetComponent<HungerComponent>('HungerComponent');  
			hungerComp.SetHunger(args.GetValue('value'));
		}

	}
}

export class SetThirstCommand implements IDevCommand {
	Keyword: string = 'setthirst';
	Format: string = '$value$';

	private _EntitiesToAct: Entities.EntityCollection; 

	constructor(actors: Entities.EntityCollection) { 
		this._EntitiesToAct = actors;
	}

	Execute(console: IDeveloperConsoleContext, args: Dictionary<any>): void {
		
		for(let entity of this._EntitiesToAct.Entities){
			let hungerComp = entity.GetComponent<ThirstComponent>('ThirstComponent');  
			hungerComp.SetThirst(args.GetValue('value'));
		}

	}
}


export class MoveToDevCommand implements IDevCommand {
	Keyword: string = 'moveto';
	Format: string = '$x$ $y$';

	private _EntityToAct: Entities.Entity;
	private _World: World;

	constructor(world: World, actor: Entities.Entity) {
		this._World = world;
		this._EntityToAct = actor;
	}

	Execute(console: IDeveloperConsoleContext, args: Dictionary<any>): void {
		
		let movementComponent = this._EntityToAct.GetComponent<MovementComponent>('MovementComponent'); 

		const x: number = parseFloat(args.GetValue('x'));
		const z: number = parseFloat(args.GetValue('y'));
 
		const movePosition: Vector3 = new Vector3(x, 1, z); 
		let result = movementComponent.MoveTo(movePosition);

		if(!result)
			console.Write('Path Not Found!', LogSeverity.WARNING);

	}
	
}