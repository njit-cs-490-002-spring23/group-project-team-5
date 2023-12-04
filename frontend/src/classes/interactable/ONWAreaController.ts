// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from 'lodash';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { GameArea, GameStatus, ONWGameState, ONWStatus } from '../../types/CoveyTownSocket';
import PlayerController from '../PlayerController';
import GameAreaController, { GameEventTypes } from './GameAreaController';

export const PLAYER_NOT_IN_GAME_ERROR = 'Player is not in game';

export const NO_GAME_IN_PROGRESS_ERROR = 'No game in progress';

export type ONWCell = 'player1' | 'player2' | 'player3' | 'player4' | 'player5' | undefined;
// eslint-disable-next-line @typescript-eslint/ban-types
export type ONWEvents = GameEventTypes & {
  onwStatusChanged: (onwStatus: string) => void;
};

/**
 * This class is responsible for managing the state of the One Night Werewolf Game, and for sending commands to the server
 */
export default class ONWAreaController extends GameAreaController<ONWGameState, ONWEvents> {
  /**
   * Returns the player with the 'Player1' game piece, if there is one, or undefined otherwise
   */
  get player1(): PlayerController | undefined {
    const player1 = this._model.game?.state.player1;
    if (player1) {
      return this.occupants.find(eachOccupant => eachOccupant.id === player1);
    }
    return undefined;
  }

  /**
   * Returns the player with the 'player2' game piece, if there is one, or undefined otherwise
   */
  get player2(): PlayerController | undefined {
    const player2 = this._model.game?.state.player2;
    if (player2) {
      return this.occupants.find(eachOccupant => eachOccupant.id === player2);
    }
    return undefined;
  }

  /**
   * Returns the player with the 'player3' game piece, if there is one, or undefined otherwise
   */
  get player3(): PlayerController | undefined {
    const player3 = this._model.game?.state.player3;
    if (player3) {
      return this.occupants.find(eachOccupant => eachOccupant.id === player3);
    }
    return undefined;
  }

  /**
   * Returns the player with the 'player4' game piece, if there is one, or undefined otherwise
   */
  get player4(): PlayerController | undefined {
    const player4 = this._model.game?.state.player4;
    if (player4) {
      return this.occupants.find(eachOccupant => eachOccupant.id === player4);
    }
    return undefined;
  }

  /**
   * Returns the player with the 'player5' game piece, if there is one, or undefined otherwise
   */
  get player5(): PlayerController | undefined {
    const player5 = this._model.game?.state.player5;
    if (player5) {
      return this.occupants.find(eachOccupant => eachOccupant.id === player5);
    }
    return undefined;
  }

  /**
   * Returns true if the current player is a player in this game
   */
  get isPlayer(): boolean {
    return this._model.game?.players.includes(this._townController.ourPlayer.id) || false;
  }

  /**
   * Returns the winner of the game, if there is one
   */
  get winner(): PlayerController | undefined {
    const winner = this._model.game?.state.winner;
    if (winner) {
      return this.occupants.find(eachOccupant => eachOccupant.id === winner);
    }
    return undefined;
  }

  /**
   * Returns the game piece of the current player, if the current player is a player in this game
   *
   * Throws an error PLAYER_NOT_IN_GAME_ERROR if the current player is not a player in this game
   */
  get gamePiece(): 'player1' | 'player2' | 'player3' | 'player4' | 'player5' {
    if (this.player1?.id === this._townController.ourPlayer.id) {
      return 'player1';
    } else if (this.player2?.id === this._townController.ourPlayer.id) {
      return 'player2';
    } else if (this.player3?.id === this._townController.ourPlayer.id) {
      return 'player3';
    } else if (this.player4?.id === this._townController.ourPlayer.id) {
      return 'player4';
    } else if (this.player5?.id === this._townController.ourPlayer.id) {
      return 'player5';
    }
    throw new Error(PLAYER_NOT_IN_GAME_ERROR);
  }

  /**
   * Returns the status of the game.
   * Defaults to 'WAITING_TO_START' if the game is not in progress
   */
  get status(): GameStatus {
    const status = this._model.game?.state.status;
    if (!status) {
      return 'WAITING_TO_START';
    }
    return status;
  }

  /**
   * Returns the onwStatus of the game.
   * Defaults to 'WAITING_TO_START' if the game is not in progress
   */
  get onwStatus(): ONWStatus {
    const onwStatus = this._model.game?.state.onwStatus;
    if (!onwStatus) {
      return 'WELCOME_PLAYERS';
    }
    return onwStatus;
  }

  /**
   * Returns true if the game is in progress
   */
  public isActive(): boolean {
    return this._model.game?.state.status === 'IN_PROGRESS';
  }
}
