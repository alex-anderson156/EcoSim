import { EntitySystem } from "../../../Systems";
import { Dictionary } from "../../../_System/Dictionary";
import { IDeveloperConsoleContext } from "../DeveloperConsole";


export interface IDevCommand {

	readonly Keyword: string;

	readonly Format: string;

	Execute(console: IDeveloperConsoleContext, args: Dictionary<any>): void;
}

 
