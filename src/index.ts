import { Game } from './game/Program';
import { GameModeType } from './game/IGameArgs';

import * as DevConsole from './game/UI/DeveloperConsole/DeveloperConsole'

import './styles/index.scss';

window.onload = () => {

	let gameMode: GameModeType = GameModeType.DEV_VIEWER;

	let urlSearchParams: URLSearchParams = new URLSearchParams(window.location.search);

	let gt = urlSearchParams.get('type');
	if (gt)
		gameMode = <GameModeType>gt;

	let instance: Game = new Game();
	instance.Run({ GameMode: gameMode });

	DevConsole.DeveloperConsole.Init();
}
