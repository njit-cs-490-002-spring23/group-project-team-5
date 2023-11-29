/* eslint-disable @typescript-eslint/no-unused-vars */
import InvalidParametersError, {
  GAME_FULL_MESSAGE,
  PLAYER_ALREADY_IN_GAME_MESSAGE,
  PLAYER_NOT_IN_GAME_MESSAGE,
} from '../../lib/InvalidParametersError';
import Player from '../../lib/Player';
import { GameMove, ONWGameState, ONWMove } from '../../types/CoveyTownSocket';
import Game from './Game';

/**
 * A ONWGame is a Game that implements the rules of One Night Werewolf
 * @see https://www.ultraboardgames.com/one-night-ultimate-werewolf/game-rules.php
 */
export default class ONWGame extends Game<ONWGameState, ONWMove> {
  // eslint-disable-next-line class-methods-use-this
  public applyMove(_move: GameMove<ONWMove>): void {
    throw new Error('Method not implemented.');
  }

  public constructor() {
    super({
      status: 'WAITING_TO_START',
    });
  }

  /**
   * Adds a player to the game.
   * Updates the game's state to reflect the new player.
   * If the game is now full (has five players), updates the game's state to set the status to IN_PROGRESS.
   *
   * @param player The player to join the game
   * @throws InvalidParametersError if the player is already in the game (PLAYER_ALREADY_IN_GAME_MESSAGE)
   *  or the game is full (GAME_FULL_MESSAGE)
   */
  protected _join(player: Player): void {
    if (
      this.state.player1 === player.id ||
      this.state.player2 === player.id ||
      this.state.player3 === player.id ||
      this.state.player4 === player.id ||
      this.state.player5 === player.id
    ) {
      throw new InvalidParametersError(PLAYER_ALREADY_IN_GAME_MESSAGE);
    }
    if (!this.state.player1) {
      this.state = {
        ...this.state,
        player1: player.id,
      };
    } else if (!this.state.player2) {
      this.state = {
        ...this.state,
        player2: player.id,
      };
    } else if (!this.state.player3) {
      this.state = {
        ...this.state,
        player3: player.id,
      };
    } else if (!this.state.player4) {
      this.state = {
        ...this.state,
        player4: player.id,
      };
    } else if (!this.state.player5) {
      this.state = {
        ...this.state,
        player5: player.id,
      };
    } else {
      throw new InvalidParametersError(GAME_FULL_MESSAGE);
    }
    if (
      this.state.player1 &&
      this.state.player2 &&
      this.state.player3 &&
      this.state.player4 &&
      this.state.player5
    ) {
      this.state = {
        ...this.state,
        status: 'IN_PROGRESS',
      };
    }
  }

  /**
   * Removes a player from the game.
   * Updates the game's state to reflect the player leaving.
   * If the game has 5 players in it at the time of call to this method,
   *   updates the game's status to OVER and sets the winner to the other player.
   * If the game does not yet have two players in it at the time of call to this method,
   *   updates the game's status to WAITING_TO_START.
   *
   * @param player The player to remove from the game
   * @throws InvalidParametersError if the player is not in the game (PLAYER_NOT_IN_GAME_MESSAGE)
   */
  protected _leave(player: Player): void {
    // Check if the player is in the game, if you remove a player in the game throw an error
    if (
      (this.state.player1 !== player.id ||
        this.state.player2 !== player.id ||
        this.state.player3 !== player.id ||
        this.state.player4 !== player.id ||
        this.state.player5 !== player.id) &&
      this.state.status === 'IN_PROGRESS'
    ) {
      this.state = {
        status: 'OVER',
        player1: undefined,
        player2: undefined,
        player3: undefined,
        player4: undefined,
        player5: undefined,
      };
    }
    if (this.state.player5 === undefined) {
      // Game not yet started, set status to 'WAITING_TO_START' and reset all players
      this.state = {
        status: 'WAITING_TO_START',
        player1: undefined,
        player2: undefined,
        player3: undefined,
        player4: undefined,
        player5: undefined,
      };
    }
  }
}
