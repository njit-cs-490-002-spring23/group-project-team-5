// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from 'lodash';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  GameArea,
  GameStatus,
  ONWGameState,
  ONWRole,
  ONWStatus,
  Player,
} from '../../types/CoveyTownSocket';
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

  /**
   * Returns the role of the current player, if the current player is a player in this game
   * defaults to Villager
   * Throws an error PLAYER_NOT_IN_GAME_ERROR if the current player is not a player in this game
   */
  get playerONWRole(): ONWRole {
    const currentPlayerID = this._townController.ourPlayer.id;

    if (this.player1?.id === currentPlayerID) {
      return this._model.game?.state.roles[0].role;
    } else if (this.player2?.id === currentPlayerID) {
      return this._model.game?.state.roles[1].role;
    } else if (this.player3?.id === currentPlayerID) {
      return this._model.game?.state.roles[2].role;
    } else if (this.player4?.id === currentPlayerID) {
      return this._model.game?.state.roles[3].role;
    } else if (this.player5?.id === currentPlayerID) {
      return this._model.game?.state.roles[4].role;
    }

    throw new Error(PLAYER_NOT_IN_GAME_ERROR);
  }

  /**
   * Assigns player roles upon beggining the game.
   * Should assign 3 villagers, 1 seer and 1 werewolf at random
   *
   * The ONWRoles list in ONWGame instance is in order corresponding to the player in that game.
   *
   * @throws InvalidParametersError if the game is not able to start due to lack of players (PLAYER_NOT_IN_GAME_MESSAGE)
   */
  public assignRoles(): void {
    if (this._model.game?.state.status === 'IN_PROGRESS') {
      // throws error if game is not in progress
      throw new Error(NO_GAME_IN_PROGRESS_ERROR);
    } else {
      // game is confirmed to be in progress and has 5 players
      /*
      player1 = this.state.roles[0]
      player2 = this.state.roles[1]
      player3 = this.state.roles[2]
      player4 = this.state.roles[3]
      player5 = this.state.roles[4]
      */
      const werewolfIndex = Math.floor(Math.random() * 5); // generates a number 0-4 for the index of the ONWRoles array that will represent the Werewolf player
      let seerIndex = werewolfIndex;
      do {
        seerIndex = Math.floor(Math.random() * 5);
      } while (seerIndex === werewolfIndex); // generates a number 0-4 for the index of the ONWRoles array that will represent the Seer player, and the do while guarantees that it will not be the same player as the Werewolf.
      for (let i = 0; i < 5; i++) {
        const game = this._model.game;
        if (game !== undefined) {
          const roles = this._model?.game?.state.roles || [];
          roles[i] = roles[i] || {};
          if (i === werewolfIndex) {
            game.state.roles[i].role = 'Werewolf';
            game.state.roles[i].seer_appearance = 'Werewolf';
            game.state.roles[i].immunity = true;
            game.state.roles[i].description =
              'You are a Werewolf who is attempting to murder the villagers without being murdered at daytime. At night, you choose a player to kill.';
          } else if (i === seerIndex) {
            game.state.roles[i].role = 'Seer';
            game.state.roles[i].seer_appearance = 'Not Werewolf';
            game.state.roles[i].immunity = false;
            game.state.roles[i].description =
              'You are a Seer who is attempting to identify the Werewolf and murder them at daytime. At night, you choose a player to see if they are a werewolf.';
          } else {
            game.state.roles[i].role = 'Villager';
            game.state.roles[i].seer_appearance = 'Not Werewolf';
            game.state.roles[i].immunity = false;
            game.state.roles[i].description =
              'You are a Villager who is attempting to identify the Werewolf and murder them at daytime. At night, you take no actions.';
          }
        }
      }
    }
  }
}
