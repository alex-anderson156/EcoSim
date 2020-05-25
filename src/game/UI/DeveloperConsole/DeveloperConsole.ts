import { WebComponentDecorator, WebComponent } from "../../_System/_WebComponent";
import * as _ from 'lodash';

import './DevConsole.scss'
import { IDevCommand } from "./Commands/IDevCommand";
import { EchoCommand } from "./Commands/EchoCommand";
import { Dictionary } from "../../_System/Dictionary";

export interface IDeveloperConsoleCommandListener {
	OnDeveloperConsoleCommand(command: string): void;
}

export enum LogSeverity {
	VERBOSE = 'Verbose',
	DEBUG = 'Debug',
	COMMAND = 'Command',
	WARNING = 'Warning',
	ERROR = 'Error',
}

export interface IDeveloperConsoleContext {
	Write(text: string, severity: LogSeverity): void;
}


@WebComponentDecorator({
	componentName: 'dev-console',
	template: `
<div class="DeveloperConsole">
	<div class="Console">
		<span class="Marker">&gt;</span>
	  <input type="text" id="ConsoleInput">
	</div>
	<div class="CommandHistory"> 
	</div>
</div>
	`
})
export class DeveloperConsole extends WebComponent implements IDeveloperConsoleContext {
	 
	public static readonly MAX_COMMANDS: number = 10;


	private static _Instance: DeveloperConsole;
	public static get Instance(): DeveloperConsole {
		if(!DeveloperConsole._Instance)
			throw 'Developer Console instance not found.';

		return DeveloperConsole._Instance;
	}

	private _$Console: HTMLInputElement;
	private _$CommandHistory: HTMLElement;
	private _HistoryItems: Array<HTMLParagraphElement>;

	private _CommandsDictionary: Dictionary<IDevCommand>;


	constructor() {
		super();
		this. _CommandsDictionary = new Dictionary<IDevCommand>();
	}

	public RenderWebComponent(): void {
		super.RenderWebComponent();
		
		this._$Console = this.querySelector('#ConsoleInput');		
		this._$Console.addEventListener('keydown', this.OnConsoleKeyDown);
		
		this._$CommandHistory = this.querySelector('.CommandHistory');
		this._HistoryItems = [];
	}


	private OnConsoleKeyDown = (event: KeyboardEvent) => {
		if(event.which != 13 || event.keyCode != 13)
			return;

		let cmdTxt: string = this._$Console.value;
		this._$Console.value = '';
				
		// parse
		// format should always be $cmd$ ...$args$

		const split = cmdTxt.split(' ');
		const command: string = split[0];

		if(!this._CommandsDictionary.ContainsKey(command)) {
			this.Write(`Unknown command '${command}'.`, LogSeverity.ERROR);
			return;
		}

		let cmdDef: IDevCommand = this._CommandsDictionary.GetValue(command);
		const argDict: Dictionary<any> = new Dictionary<any>();

		let argDefs = cmdDef.Format.split(' ');
		for(let i: number = 0; i < argDefs.length; i++) {

			const argName: string = argDefs[i];
			const formattedArgName = argName.replace('$', '').replace('$', '').replace('!!', '');
			let argValue: any = '';

			if(argName.indexOf('!!') > 0) {
				// Open ended arg.
				for(let j = i; j < split.length - 1; j++) {
					argValue += (split[j + 1] + ' ');
				}
			}
			else {
				argValue = split[i + 1];				
			} 

			argDict.Add(formattedArgName, argValue);
		}

		this.Write(cmdTxt, LogSeverity.COMMAND);
		cmdDef.Execute(this, argDict);
	}


	public Write(text: string, severity: LogSeverity): void {
		let $e = document.createElement('p');
		$e.className = 'HistoryItem ' + severity;
		$e.innerText = text;
 
		this._HistoryItems.push($e);

		if(this._HistoryItems.length > DeveloperConsole.MAX_COMMANDS) {
			let $elemToRemove = this._HistoryItems.shift();
			$elemToRemove.remove();
		}
				
		this._$CommandHistory.prepend($e);  
	}

	private InternalRegister(cmd: IDevCommand) {
		this._CommandsDictionary.SetValue(cmd.Keyword, cmd);
	}

	public static Register(cmd: IDevCommand) {
		DeveloperConsole.Instance.InternalRegister(cmd);
	}


	public static Init() {
		DeveloperConsole._Instance = document.querySelector('dev-console'); 
		DeveloperConsole.Register(new EchoCommand());
	}
}