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
   * Defaults to a generic Villager role
   * Throws an error PLAYER_NOT_IN_GAME_ERROR if the current player is not a player in this game
   */
  public playerONWRole(player: Player): ONWRole {
    const game = this._model.game;
    if (!game) {
      throw new Error(NO_GAME_IN_PROGRESS_ERROR);
    }

    const playerIndex = this.playerIDToONWRole(player);

    if (playerIndex === 0) {
      return {
        role: 'Werewolf',
        seer_appearance: 'Werewolf',
        immunity: true,
        description:
          'You are a Werewolf who is attempting to murder the villagers without being murdered at daytime. At night, you choose a player to kill.',
      };
    } else if (playerIndex === 1) {
      return {
        role: 'Seer',
        seer_appearance: 'Not Werewolf',
        immunity: false,
        description:
          'You are a Seer who is attempting to identify the Werewolf and murder them at daytime. At night, you choose a player to see if they are a werewolf.',
      };
    } else {
      return {
        role: 'Villager',
        seer_appearance: 'Not Werewolf',
        immunity: false,
        description:
          'You are a Villager who is attempting to identify the Werewolf and murder them at daytime. At night, you take no actions.',
      };
    }
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
    if (this._model.game?.state.status !== 'IN_PROGRESS') {
      // throws error if game is not in progress
      throw new Error(NO_GAME_IN_PROGRESS_ERROR);
    } else {
      const playerCount = 5;
      const roles: string[] = ['Villager', 'Villager', 'Villager', 'Seer', 'Werewolf'];

      // Log the initial roles array for debugging
      console.log('Initial roles array:', roles);

      // Shuffle the roles array to randomize the assignments
      for (let i = roles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [roles[i], roles[j]] = [roles[j], roles[i]];
      }

      // Log the shuffled roles array for debugging
      console.log('Shuffled roles array:', roles);

      for (let i = 0; i < playerCount; i++) {
        const game = this._model.game;
        if (game !== undefined) {
          const role = roles[i];
          // Ensure that game.state.roles array is initialized
          game.state.roles[i] = game.state.roles[i] || {};

          game.state.roles[i].role = role;

          // Add additional logging for debugging
          console.log(`Player ${i + 1} role assignment: ${role}`);

          if (role === 'Werewolf') {
            game.state.roles[i].seer_appearance = 'Werewolf';
            game.state.roles[i].immunity = true;
            game.state.roles[i].description =
              'You are a Werewolf who is attempting to murder the villagers without being murdered at daytime. At night, you choose a player to kill.';
          } else if (role === 'Seer') {
            game.state.roles[i].seer_appearance = 'Not Werewolf';
            game.state.roles[i].immunity = false;
            game.state.roles[i].description =
              'You are a Seer who is attempting to identify the Werewolf and murder them at daytime. At night, you choose a player to see if they are a werewolf.';
          } else {
            game.state.roles[i].seer_appearance = 'Not Werewolf';
            game.state.roles[i].immunity = false;
            game.state.roles[i].description =
              'You are a Villager who is attempting to identify the Werewolf and murder them at daytime. At night, you take no actions.';
          }
        }
        console.log(`SECOND : Player ${i + 1} was assigned the role: ${game.state.roles[i].role}`);
      }
    }
  }

  /**
   Handles a vote from a player to kick another player.
   Updates the game state to refelct the vote
   @param voter The player casting the vote
   @param target The player being voted against
   @throws InvalidParametersError if the voter or target is not in the game
  * */
   public handleVote(voter: Player, target: Player): void {
    if (!this.isPlayerInGame(voter) || !this.isPlayerInGame(target) || voter.id === target.id) {
      throw new InvalidParametersError('Invalid vote parameters');
    }

    // Update the vote count for the target player
    this.voteCount[target.id] = (this.voteCount[target.id] || 0) + 1;

    if (Object.keys(this.voteCount).length === this.getPlayers().length) {
      // Figuring out who has the most votes.
      const playerWithMostVotes = Object.keys(this.voteCount).reduce((prevPlayer, currentPlayer) =>
        this.voteCount[currentPlayer] > this.voteCount[prevPlayer] ? currentPlayer : prevPlayer,
      );

      this._handleVoteResult(playerWithMostVotes);

      // Clearing the vote for next round
      this.voteCount = {};
    }
  }

  /**
   * Handles the result of the vote.
   *
   * @param kickedPlayerID The ID of the player with the most votes
   */
  private _handleVoteResult(kickedPlayerID: string): void {
    // Kicking player based on # of votes.
    const kickedPlayer = this.getPlayerByID(kickedPlayerID);
    if (kickedPlayer) {
      this.leave(kickedPlayer);
    }
  }

  /**
   * Pairs each player's ID with their assigned role in the game
   */
  public playerIDToONWRole(player: Player): number | undefined {
    const game = this._model.game;
    if (!game) {
      // Handle the case where the game state is not available
      return undefined;
    }
    console.log('calling playerIDRole');
    if (
      game?.state.player1 !== player.id &&
      game?.state.player2 !== player.id &&
      game?.state.player3 !== player.id &&
      game?.state.player4 !== player.id &&
      game?.state.player5 !== player.id
    ) {
      return undefined;
    }

    if (game?.state.player1 === player.id) return 0;
    if (game?.state.player2 === player.id) return 1;
    if (game?.state.player3 === player.id) return 2;
    if (game?.state.player4 === player.id) return 3;
    return 4;
  }

  /*
  public checkForGameEnding(): void {
    if (this._model.game?.state.status === 'OVER') {
      this._model.game?.state = {
        ...this.state,
        status: 'OVER',
      };
      return;
    }
  }
  */
}
