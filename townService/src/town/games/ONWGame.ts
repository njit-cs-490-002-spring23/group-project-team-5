/* eslint-disable @typescript-eslint/no-unused-vars */
import InvalidParametersError, {
  GAME_FULL_MESSAGE,
  PLAYER_ALREADY_IN_GAME_MESSAGE,
  PLAYER_NOT_IN_GAME_MESSAGE,
} from '../../lib/InvalidParametersError';
import Player from '../../lib/Player';
import { GameMove, ONWGameState, ONWMove, ONWRole } from '../../types/CoveyTownSocket';
import Game from './Game';

/**
 * A ONWGame is a Game that implements the rules of One Night Werewolf.
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
      roles: [],
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
   * If the game has two players in it at the time of call to this method,
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
      this.state.player1 !== player.id &&
      this.state.player2 !== player.id &&
      this.state.player3 !== player.id &&
      this.state.player4 !== player.id &&
      this.state.player5 !== player.id
    ) {
      throw new InvalidParametersError(PLAYER_NOT_IN_GAME_MESSAGE);
    }
    // handles case where the game has started, remain in WAITING_TO_START and reset all the players
    if (this.state.player5 === undefined) {
      if (
        this.state.player1 !== player.id &&
        this.state.player2 !== player.id &&
        this.state.player3 !== player.id &&
        this.state.player4 !== player.id &&
        this.state.player5 !== player.id
      ) {
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
    // handles case where the game has started, auto ends and reset all the players
    if (this.state.player5 !== undefined) {
      if (
        this.state.player1 !== player.id &&
        this.state.player2 !== player.id &&
        this.state.player3 !== player.id &&
        this.state.player4 !== player.id &&
        this.state.player5 !== player.id
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
    if (this.state.status != 'IN_PROGRESS') { //throws error if game is not in progress
      throw new InvalidParametersError(PLAYER_NOT_IN_GAME_MESSAGE);
    }
    else { // game is confirmed to be in progress and has 5 players

      /*
      player1 = this.state.roles[0]
      player2 = this.state.roles[1]
      player3 = this.state.roles[2]
      player4 = this.state.roles[3]
      player5 = this.state.roles[4]
      */
      let werewolfIndex = Math.floor(Math.random() * 5); // generates a number 0-4 for the index of the ONWRoles array that will represent the Werewolf player
      let seerIndex = werewolfIndex; 
      do {
        seerIndex = Math.floor(Math.random() * 5);
      } while (seerIndex === werewolfIndex); // generates a number 0-4 for the index of the ONWRoles array that will represent the Seer player, and the do while guarantees that it will not be the same player as the Werewolf.
      for (let i = 0; i < 5; i++) {
        if (!this.state.roles[i]) {
          this.state.roles[i] = {};
        }
        if (i == werewolfIndex) {
          this.state.roles[i].role = 'Werewolf';
          this.state.roles[i].seer_appearance = 'Werewolf';
          this.state.roles[i].immunity = true;
          this.state.roles[i].description = 'You are a Werewolf who is attempting to murder the villagers without being murdered at daytime. At night, you choose a player to kill.';
        }
        else if (i == seerIndex) {
          this.state.roles[i].role = 'Seer';
          this.state.roles[i].seer_appearance = 'Not Werewolf';
          this.state.roles[i].immunity = false;
          this.state.roles[i].description = 'You are a Seer who is attempting to identify the Werewolf and murder them at daytime. At night, you choose a player to see if they are a werewolf.';
        }
        else {
          this.state.roles[i].role = 'Villager';
          this.state.roles[i].seer_appearance = 'Not Werewolf';
          this.state.roles[i].immunity = false;
          this.state.roles[i].description = 'You are a Villager who is attempting to identify the Werewolf and murder them at daytime. At night, you take no actions.';
        }
      }
    }
  }
  
  /**
   * Matches a Player to the ONWRole roles element that is their role in this instance of the game.
   *
   * @param player The player to fetch their role information for.
   * @throws InvalidParametersError if the player is not in the game (PLAYER_NOT_IN_GAME_MESSAGE)
   * @returns number representing the index of the ONWRole roles array in this.state
   */
  private playerIDToONWRole(player: Player): number {
    if (
      this.state.player1 !== player.id &&
      this.state.player2 !== player.id &&
      this.state.player3 !== player.id &&
      this.state.player4 !== player.id &&
      this.state.player5 !== player.id
    ) {
      throw new InvalidParametersError(PLAYER_NOT_IN_GAME_MESSAGE);
    }

    if (this.state.player1 === player.id) return 0;
    else if (this.state.player2 === player.id) return 1;
    else if (this.state.player3 === player.id) return 2;
    else if (this.state.player4 === player.id) return 3;
    return 4;
  }
}
