import { Game } from './game/Program';
import { GameModeType } from './game/IGameArgs';

import './styles/index.scss';

window.onload = () => {

	let gameMode: GameModeType = GameModeType.DEV_VIEWER;

	let urlSearchParams: URLSearchParams = new URLSearchParams(window.location.search);

	let gt = urlSearchParams.get('type');
	if (gt)
		gameMode = <GameModeType>gt;

	let instance: Game = new Game();
	instance.Run({ GameMode: gameMode });
}
