export enum GameModeType {
	DEV_VIEWER = 'DEV_VIEWER',
	SIMULATION = 'SIMULATION'
}

export interface IGameArgs { 
	GameMode: GameModeType; 
}