import { Dictionary } from "../../../_System/Dictionary";
import { IDeveloperConsoleContext, LogSeverity } from "../DeveloperConsole";
import { IDevCommand } from "./IDevCommand";

export class EchoCommand implements IDevCommand {

	public readonly Keyword: string = 'echo';

	public readonly Format: string = '$text!!$';

	Execute(console: IDeveloperConsoleContext, args: Dictionary<any>): void {
		console.Write(args.GetValue('text'), LogSeverity.VERBOSE );
	}
}
